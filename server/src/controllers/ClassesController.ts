import { Request, Response} from 'express'

import db from "../database/connection";

import convert_Hours_to_Minutes from '../utils/convert_Hours_to_Minutes';

interface ScheduleItem{
    week_day: number,
    from: string,
    to: string
}


export default class ClassesController{
    async index(request: Request, response: Response) {
        const filters = request.query;

        //
        const subject   = filters.subject as string;
        const time      = filters.time as string;
        const week_day  = filters.week_day as string;
        //

        if(!filters.subject || !filters.week_day || !filters.time){
                return response.status(400).json({
                error: "Oh meu querido ta faltando os filtros ai hein, vamo faze esse negocio direito"
            })
    }

        const timeInMinutes = convert_Hours_to_Minutes(time as string);

        const classes = await db('classes')
            .whereExists(function(){
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` =  ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })

            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);

        return response.json(classes);
    }

    async create(request: Request, response: Response)  {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        const trx = await db.transaction();
    
        try{
            const InsertedUsersId = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });
        
            const user_Id = InsertedUsersId[0];
        
            const InsertedClassesId = await trx('classes').insert({
                subject,
                cost,
                user_Id
            });
        
            const class_id = InsertedClassesId[0];
        
            const class_schedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convert_Hours_to_Minutes(scheduleItem.from),
                    to: convert_Hours_to_Minutes(scheduleItem.to)
                };
            });
        
            await trx('class_schedule').insert(class_schedule);
        
            await trx.commit();
        
            console.log('Criado com sucesso!');
        
            return response.status(201).send();  
            
            //return response.json( {message: 'hello'} );
            //https://localhost:3333/classes
        } catch (err){
            // desfaz a alteracao em caso d erro
            await trx.rollback();

            console.log(err);
    
            return response.status(400).json({
                error: 'Erro inesperado ao criar nova classe... Verifica tudo ai e faz d novo filhao'
            });
        }
    
    }
};