export const responseError = (message: string, code: number = 400) => {
    return Response.json(
      {
        message: message,
      },
      { status: code }
    );
  };
  
  export const responseSuccess = (message: string, code: number = 200) => {
    return Response.json({
      message: message
    }, {status: code})
  }