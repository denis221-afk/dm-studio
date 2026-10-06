export const asset=(path:string)=>process.env.NODE_ENV==="production"?`/dm-studio${path}`:path;
