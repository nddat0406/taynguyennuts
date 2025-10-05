export const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers.get('Authorization')?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

export const getMappingMetaData = <T = unknown>(data: any[]): T => {
  return data.reduce((accumulator: { [x: string]: boolean; }, currentValue: { key: any; value: any; }) => {
    const { key, value } = currentValue;
    if (key) {
      accumulator[key] = value;
      if (value === 'true') accumulator[key] = true;
      if (value === 'false') accumulator[key] = false;
    }
    return accumulator;
  }, {});
};

export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};
