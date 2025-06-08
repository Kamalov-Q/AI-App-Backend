import bcrypt from 'bcryptjs';
export const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        console.error(`Error while hashing password: ${error}`);
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
        return isPasswordMatch;
    } catch (error) {
        console.error(`Error while comparing password: ${error}`);
    }
};