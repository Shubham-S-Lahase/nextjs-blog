import jwt from 'jsonwebtoken';

export const signToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded Token in verifyToken:', decoded); 
    return decoded;  
  } catch (error) {
    return null;
  }
}
