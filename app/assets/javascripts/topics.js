$(function() {
  $("#add-topic").click(function () {
    var session_id = $(".topic-area").data("id");
    $.get('/sessions/'+session_id+'/topics/new')
  });

  $(".editable-session").editable({
    placement: 'bottom',
    title: 'Update Title',
    pk: function() {
      return $(".topic-area").data("id");
    },
    url: function(params) {
      $.post( "/sessions/"+params.pk+"/update_title",params);
    },   
    showbuttons: true
  });

  $("#clear-topics").click(removeTopics);

  $(".topic-area" ).on("click", ".vote-up", upVote);
  $(".topic-area" ).on("click", ".vote-down", downVote);
  $(".topic-area" ).on("click", ".topic-remove", removeTopic);

  addTopicListeners();
  addAreaListeners();
});

function upVote() {
  var topic = $(this).closest(".topic");
  var session_id = topic.closest(".topic-area").data("id");
  var topic_id = topic.data("id");

  $.post( "/sessions/"+session_id+"/topics/"+topic_id+"/up_vote");
}

function downVote() {
  var topic = $(this).closest(".topic");
  var session_id = topic.closest(".topic-area").data("id");
  var topic_id = topic.data("id");
  var votes = topic.find(".votes");
  var votes_int = parseInt(votes.text());

  if (votes_int - 1 < 0) {
    return
  }  

  $.post( "/sessions/"+session_id+"/topics/"+topic_id+"/down_vote");
}

function removeTopic() {
  var topic = $(this).closest(".topic");
  var session_id = topic.closest(".topic-area").data("id");
  var topic_id = topic.data("id");

  $.ajax({
    url: "/sessions/"+session_id+"/topics/"+topic_id,
    type: "DELETE"
  }); 
}

function removeTopics() {
  var session_id = $(".topic-area").data("id");

  $.post( "/sessions/"+session_id+"/topics/remove_all"); 
}

function addTopicListeners() {
  $(".topic").draggable({
    containment: ".topic-area",
    stack:       ".draggable",
    start: function (event, ui) {
      $(this).addClass('dragging');
    },
    drag: function (event, ui) {
      var coord = $(this).position();
      var topic = {
        id: $(this).data("id"),
        x: coord.left,
        y: coord.top
      }
      dispatcher.trigger('move_topic', topic);
    },
    stop: function (event, ui) {
      $(this).removeClass('dragging');
    }
  });

  $(".editable-topic").editable({
    type: 'textarea',
    title: 'Update Description',
    pk: function() {
      return $(this).closest(".topic").data("id");
    },
    url: function(params) {
      var session_id = $(this).closest(".topic-area").data("id");

      $.post( "/sessions/"+session_id+"/topics/"+params.pk+"/update_description",params);
    },   
    showbuttons: true
  });
}

function addAreaListeners() {
  $(".todiscuss").droppable({
    hoverClass: "todiscuss-discussed-hover",
    drop: function(event, ui) {
      updateStage (event, ui, 'todiscuss')
    }
  });

  $(".discussing").droppable({
    hoverClass: "discussing-hover",
    drop: function(event, ui) {
      updateStage (event, ui, 'discussing')
    }
  });

  $(".discussed").droppable({
    hoverClass: "todiscuss-discussed-hover",
    drop: function(event, ui) {
      updateStage (event, ui, 'discussed')
    }
  });
}

function updateStage(event, ui, area) {
  var topic_id = ui.draggable.data("id");
  var session_id = ui.draggable.closest(".topic-area").data("id");
  var coord = ui.position;  
  
  $.post( "/sessions/"+session_id+"/topics/"+topic_id+"/update_stage",
    {'stage':area, 'x':coord.left, 'y':coord.top});
}