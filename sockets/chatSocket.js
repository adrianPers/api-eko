const conversas = {};

module.exports = (io) => {

  io.on('connection', (socket) => {

    console.log(
      'Socket conectado:',
      socket.id
    );


    // =========================
    // ENTRAR EM UMA CONVERSA
    // =========================

    socket.on(
      'entrar-conversa',
      ({ conversaId, nome }) => {

        socket.join(conversaId);


        // cria conversa caso não exista
        if (!conversas[conversaId]) {

          conversas[conversaId] = {

            id: conversaId,

            nomeUsuario: nome,

            mensagens: [],

            sockets: []

          };


          // avisa admins
          io.emit(
            "nova-conversa",

            conversas[conversaId]
          );

        }


        // adiciona socket na conversa
        conversas[
          conversaId
        ].sockets.push(socket.id);


        console.log(
          `Socket ${socket.id}
           entrou em ${conversaId}`
        );

      }
    );



    // =========================
    // ENVIAR MENSAGEM
    // =========================

    socket.on(
      'enviar-mensagem',
      (mensagem) => {

        const conversaId =
          mensagem.idConversa;


        // segurança
        if (!conversas[conversaId]) {

          conversas[conversaId] = {

            id: conversaId,

            nomeUsuario: mensagem.nome,

            mensagens: [],

            sockets: []

          };

        }



        // salva mensagem
        conversas[
          conversaId
        ].mensagens.push(mensagem);

        // envia para todos da room
        io.to(
          conversaId
        ).emit(
          'receber-mensagem',
          mensagem
        );


        console.log(
          'Mensagem enviada:',
          mensagem
        );

        io.emit(
          "atualizar-conversa",
          conversas[
          conversaId
          ]
        );

      }
    );



    // =========================
    // LISTAR CONVERSAS
    // =========================

    socket.on(
      'listar-conversas',
      () => {

        socket.emit(
          'lista-conversas',
          Object.values(conversas)
        );

      }
    );



    // =========================
    // BUSCAR MENSAGENS
    // =========================

    socket.on(
      'buscar-mensagens',
      (conversaId) => {

        // conversa não existe
        if (!conversas[conversaId]) {

          socket.emit(
            'mensagens-conversa',
            []
          );

          return;

        }


        socket.emit(
          'mensagens-conversa',

          conversas[
            conversaId
          ].mensagens
        );

      }
    );



    // =========================
    // DESCONECTAR
    // =========================

    socket.on(
      'disconnect',
      () => {

        console.log(
          'Socket desconectado:',
          socket.id
        );


        // remove socket das conversas
        Object.keys(conversas).forEach(
          (conversaId) => {

            conversas[
              conversaId
            ].sockets = conversas[
              conversaId
            ].sockets.filter(
              (id) => id !== socket.id
            );

          }
        );

      }
    );

  });

};