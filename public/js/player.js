
const player = ({
  userId = '',
  userName = '',
  mesh = null,
} =  {}) => ({
  userId,
  userName,
  mesh,
  getPosition() {
    const { x, y, z } = mesh.position;
    return { x, y, z };
  },
  setPosition() {
    
  },
});
