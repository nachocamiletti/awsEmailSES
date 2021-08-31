"use strict";
const AWS = require("aws-sdk");

const ses = new AWS.SES({
  region: "us-east-2", // region donde esta configurado el servicio SES
});

module.exports.sendEmail = (event, context, callback) => {
  var params = {
    Destination: {
      /* REQUERIDO */
      // CC emails: [
      //   ,
      //   /* emails */
      // ],
      ToAddresses: [
        event.pathParameters.ToEmail,
        /* emails */
      ],
    },
    Message: {
      /* REQUERIDO */
      Body: {
        /* REQUERIDO */
        Html: {
          Charset: "UTF-8",
          Data: "Codigo enviado: " + event.pathParameters.Code,
        },
        Text: {
          Charset: "UTF-8",
          Data: "Codigo para validación" + event.pathParameters.Code,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Email de registro - Serverless",
      },
    },
    Source: "bienvenido@lambdacurso.com" /* REQUERIDO */,
  };

  ses.sendEmail(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: false,
          message: "Email no enviado",
          message2: error.message,
        }),
      });
      return;
    }
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Email enviado correctamente",
      }),
    };
    callback(null, response);
  });
};
