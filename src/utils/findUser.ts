import { Database } from 'database/database'

export const findUserByEmail = async (email: string) => {
  try {
    const user = await Database.user.findUnique({ where: { email } })
    
    return user
  } catch {
    return null
  }
}
  
export const findUserById = async (id: string) => {
	try {
		const user = await Database.user.findUnique({ where: { id } });

		return user;
	} catch {
		return null;
	}
};