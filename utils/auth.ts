import bcrypt from 'bcryptjs';

// Generate a random password
export const generateRandomPassword = (): string => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each required character type
  const lowercase = charset.match(/[a-z]/);
  const uppercase = charset.match(/[A-Z]/);
  const number = charset.match(/[0-9]/);
  const special = charset.match(/[!@#$%^&*]/);

  if (!lowercase || !uppercase || !number || !special) {
    throw new Error('Invalid charset for password generation');
  }

  password += lowercase[0];
  password += uppercase[0];
  password += number[0];
  password += special[0];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Generate password hash
export const generatePasswordHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Verify password
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Generate a secure reset token
export const generateResetToken = (email: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}-${Buffer.from(email).toString('base64')}`;
}; 