import { isArray, isObject } from "util";

export const responseError = (message: any, code: number = 400) => {

  if (isObject(message)) return Response.json(message, {status: code})
    return Response.json(
      {
        message: message,
      },
      { status: code }
    );
  };

  
  export const responseSuccess = (message: any, code: number = 200) => {
    if (isObject(message)) return Response.json(message, { status: code });
    return Response.json({
      message: message
    }, {status: code})
  }