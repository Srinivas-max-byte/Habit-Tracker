  // For opening the create habit form
  function openForm() {
    document.getElementById("myForm").style.display = "block";
  }

  // For closing he habit form.
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }

  let weeklyContainer = document.querySelectorAll(".weekly__container");
  // This willl show the Daily view of the habit.
  function showDailyData() {
    // console.log("Clicked in daily")
  }
  // This will show the Weekly view of habit
  function showWeeklyData() {
    // console.log("clisked on weekly")
  }

  // Function to create the habit submitted in form.
  let createHabit = function () {

    var newHabitForm = $("#new-habit-form");
    console.log(newHabitForm);

    newHabitForm.submit(function (event) {
      console.log("Starting of XHR request");
      event.preventDefault();
      // For sending the ajax request.
      $.ajax({
        type: "POST",
        url: "/create-habit",
        data: newHabitForm.serialize(),
        success: function (data) {
          let newHabit = newHabitDom(data.data.habit);
          $("#habit-container-list").prepend(newHabit);
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };


  // For creating a DOM of new habit for dynamically attaching it.
  let newHabitDom = function (habit) {
    return $(`<li class="habit-container-list-item" id="${habit._id}">
    <div class="habit-container-item">
      <%let currentDate = new Date(); let day = currentDate.getDay(); let
      status = habit.days[day]%>
      <div style="display: flex; justify-content: space-between">
        <i class="fa-solid fa-list-check"> Habit : ${habit.description}</i>
        <i class="fa-regular fa-clock"> ${habit.time}</i>
      </div>
      <div style="display: flex; justify-content: space-between">
        <a href="/toggle-status/${habit._id}">
          <% if(status=='yes'){ %>
          <i class="fas fa-check-circle"> Done </i>
          <% } else if(status=='no'){ %>
          <i class="fas fa-times-circle"> Not Done </i>
          <% } else { %>
          <i class="fas fa-minus-circle"> Action not taken </i>
          <% } %>
        </a>
        <a href="/favourite-habit/${habit._id}">
          <% if(habit.isFav == true){ %>
          <i class="fa-solid fa-star"></i>
          <% } else { %>
          <i class="fa-regular fa-star"></i>
          <% } %>
        </a>
      </div>
      <div style="display: flex; justify-content: space-between">
        <p>Daily Completed Habit Count: ${habit.completedCount}</p>
        <p>Longest Streak: ${habit.longestStreak}</p>
        <a href="/delete-habit/${habit._id}"><i class="fa-regular fa-trash-can"></i></a>
      </div>
    </div>
  </li>`);
  };

// method to delete a post from DOM
let deleteHabit = function (deleteLink) {
  $(deleteLink).click(function (event) {
    event.preventDefault();

    $.ajax({
      type: "get",
      url: $(deleteLink).prop("href"),
      success: function (data) {
        $(`#details-${data.data.habit_id}`).remove();
      },
      error: function (error) {
        console.log(error.responseText);
      },
    });
  });
};

// loop over all the existing Habits on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
let convertHabitsToAjax = function () {
  $("#habit-container>ul>li").each(function () {
    let self = $(this);
    let deleteButton = $(" .delete-habit-button", self);
    deleteHabit(deleteButton);
    // get the post's id by splitting the id attribute
    // let postId = self.prop("id").split("-")[1];
    // new PostComments(postId);
  });
};

createHabit();
convertHabitsToAjax();
