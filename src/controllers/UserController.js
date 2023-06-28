import getLogger from "../utils/logger.js";
import UsersService from "../services/users.service.js";

class UserController {

    static async getAllUsers(req, res) {
        try {
            const users = await UsersService.get().catch(() => {
                throw new Error(JSON.stringify({ detail: 'No se encontro usuarios' }))
            })
            return res.json(users);
        } catch (err) {
            return res.status(400).json({
                message: 'Error al obtener los usuarios',
                error: err.message
            });
        };
    }


    static async updateRoleById(req, res) {
        try {
            const { id } = req.params;
            const user = await UsersService.getById(id).catch(() => {
                throw new Error(JSON.stringify({ detail: 'El usuario no fue encontrado' }))
            })
            const role = req.body.role.toLowerCase()
            if(user.role === role ){
                return res.json({
                    message: 'El rol del usuario no puede ser el mismo'
                });
            }
            user.role = role 
            await user.save();
            return res.json({
                message: 'El rol del usuario fue actualizado exitosamente'
            });
        } catch (err) {
            return res.status(400).json({
                message: 'Error al actualizar el rol del usuario',
                error: JSON.parse(err.message)
            });
        };
    }

}

export default UserController;