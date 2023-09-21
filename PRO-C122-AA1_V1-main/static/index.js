var date = new Date()
let display_date = "Fecha:" + date.toLocaleDateString()

let predicted_emotion;

$(document).ready(function () {
    $("#display_date").html(display_date)
    $('#save_button').prop('disabled', true);
    displayBot()
})

$(function () {
    $("#predict_button").click(function () {

        let input_data = {
            "text": $("#text").val()
        }
        $.ajax({
            type: 'POST',
            url: "/predict-emotion",
            data: JSON.stringify(input_data),
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {

                predicted_emotion = result.data.predicted_emotion
                emotion_img_url=result.data.predicted_emotion_img_url
                
                //Enviar la emoción predecida y el URL de la imagen a HTML.
                $("#prediction").html(predicted_emotion)
                $("#emo_img_url").attr('src', emotion_img_url);

                //Establecer la pantalla. 
                $('#prediction').css("display", "");
                $('#emo_img_url').css("display", "");

               //Activar el botón de guardar
                $('#save_button').prop('disabled', false);
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        });
    });

    $("#save_button").click(function () {
        save_data = {
            "date": display_date,
            "text": $("#text").val(),
            "emotion": predicted_emotion
        }
        $.ajax({
            type: 'POST',
            url: "/save-entry",
            data: JSON.stringify(save_data),
            dataType: "json",
            contentType: 'application/json',
            success: function () {
                alert("¡Tu entrada se ha guardado exitosamente!")
                window.location.reload()
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        });

    });
})



function displayBot() {
    $('.chatbox__button').click(function () {
        $('.chatbox__chat').toggle()
    });
    //Iniciar la conversación con el bot.
    askBot()
}

function askBot() {
    $("#send_button").click(function () {

        var user_bot_input_text = $("#bot_input_text").val()

        if (user_bot_input_text != "") {
           
            $("#chat_messages").append('<div class="user__messages">' + user_bot_input_text + ' </div>')
            
            //Vaciar la entrada de texto después de enviar el mensaje.
            $("#bot_input_text").val('');

            let chat_input_data = {
                "user_bot_input_text": user_bot_input_text
            }
            //Escribe la llamada a AJAX aquí.
            $.ajax({
                type:"POST",
                url:"/bot-response",
                data:JSON.stringify(chat_input_data),
                dataType: "json",
                contentType: "application/json",
                    success:function(result){
                        $("#chat_messages").append('<div class="bot_messages">'+result.bot_response+'</div>')
                        $('.chatbox_message_container').animate({
                            scrollTop:$('.chatbot_message_container')[0].scrollHeight},1000);
                    },
                    error:function (result){
                        alert(result.responseJSON.message)
                    }

            });

        }

    })
   
      //Send message if Enter key(key code is 13) pressed message 
        $("#bot_input_text").keypress(function(e){
            if(e.wich == 13){
                $("send_button").click();
            }
        });
        }
