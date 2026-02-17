const User = require('../models/User');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const Barbershop = require('../models/Barbershop');
const { Op, fn, col } = require('sequelize');

exports.getStats = async (req, res) => {
    try {
        // 1. Total de clientes (role_id = 3)
        const totalClients = await User.count({ where: { role_id: 3 } });

        // 2. Total de servicios
        const totalServices = await Service.count({ where: { is_active: true } });

        // 3. Citas para hoy
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const appointmentsToday = await Appointment.count({
            where: { date: todayStr }
        });

        // 4. Ganancias (Solo citas 'completada')
        const getEarnings = async (startDate) => {
            const result = await Appointment.findAll({
                where: {
                    status: 'completada',
                    date: { [Op.gte]: startDate }
                },
                include: [{ model: Service, as: 'service', attributes: ['price'] }],
                raw: true,
                nest: true
            });
            return result.reduce((acc, curr) => acc + parseFloat(curr.service.price || 0), 0);
        };

        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const earningsToday = await getEarnings(todayStr);
        const earningsWeekly = await getEarnings(sevenDaysAgo.toISOString().split('T')[0]);
        const earningsMonthly = await getEarnings(firstDayOfMonth.toISOString().split('T')[0]);
        const earningsYearly = await getEarnings(firstDayOfYear.toISOString().split('T')[0]);

        // 5. Ganancias por Barbero
        const earningsPerBarber = await Appointment.findAll({
            where: { status: 'completada' },
            attributes: [
                'barber_id',
                [fn('SUM', col('service.price')), 'total_revenue']
            ],
            include: [
                { model: User, as: 'barber', attributes: ['full_name', 'username'] },
                { model: Service, as: 'service', attributes: [] }
            ],
            group: ['barber_id', 'barber.id'],
            raw: true,
            nest: true
        });

        // 6. Citas recientes (últimas 5)
        const recentAppointments = await Appointment.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            include: [
                { model: User, as: 'user', attributes: ['full_name', 'username'] },
                { model: User, as: 'barber', attributes: ['full_name'] },
                { model: Service, as: 'service', attributes: ['name', 'price'] }
            ]
        });

        res.json({
            totalClients,
            totalServices,
            appointmentsToday,
            earningsToday,
            earningsWeekly,
            earningsMonthly,
            earningsYearly,
            earningsPerBarber,
            recentAppointments
        });

    } catch (error) {
        console.error('❌ Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
    }
};
