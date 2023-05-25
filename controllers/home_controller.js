const Habit = require("../models/habit.js");
const JSJoda = require("js-joda");
const LocalDate = JSJoda.LocalDate;

// Display all Habits when page loads.
module.exports.home = async function (req, res) {
  try {
    console.log("Opened Again")
    const date = new Date();
    // let day = date.getDay();
    let allHabits = await Habit.find({});

    // for (let habit of allHabits) {
    //   habit.days.set(day, "none");
    //   await habit.save();
    // }

    allHabits = await Habit.find({});
    return res.render("home", {
      title : "Habit Tracker",
      habitsList: allHabits,
    });
  } catch (err) {
    console.log("Error in fetching the habits");
  }
};

// Controller to create a habit.
module.exports.createHabit = async function (req, res) {
  try {
    // Declaring initial status of 1 week for each habit.
    let days = ["none", "none", "none", "none", "none", "none", "none"];

    // All completed dates collection.
    let completedDates = [];
    // Creating new habit.
    const newHabit = new Habit({
      description: req.body.description,
      time: req.body.time,
      creationDate: LocalDate.now().toString(),
      completedDates: completedDates,
      days: days,
    });
    const habit = await newHabit.save();
    if (req.xhr) {
      console.log("Inside XHR check")
      return res.status(200).json({
        data: {
          habit: habit,
        },
        message: "Habit created!",
      });
    }

    return res.redirect("back");
  } catch (error) {
    console.log("Error in creating habit");
    return res.redirect("back");
  }
};

// Controller to delete a habit.
module.exports.deleteHabit = async function (req, res) {
  try {
    let id = req.params.id;
    const delResponse = await Habit.findByIdAndDelete(id);

    if (req.xhr) {
      return res.status(200).json({
        data: {
          habit_id: req.params.id,
        },
        message: "Habit deleted",
      });
    }

    return res.redirect("back");
  } catch (error) {
    console.log("Error in deleting Habit");
  }
};

// Controller to favourite a habit.
module.exports.favouriteHabit = async function (req, res) {
  try {
    let id = req.params.id;
    let favHabit = await Habit.findById(id);
    favHabit.isFav = !favHabit.isFav;
    await favHabit.save();
    return res.redirect("back");
  } catch (error) {
    console.log("Error");
  }
};

// Controller for toggling status.
module.exports.toggleStatus = async function (req, res) {
  try {
    let id = req.params.id;
    const todaysDay = req.params.day;

    let today = req.params.date;
    today = today.replaceAll('-','/');
    // Ignore this is not used
    // const search = '-';
    // const replaceWith = '/';
    // const result = today.split(search).join(replaceWith);  
    // let dateInString = todaysDate.getFullYear().toString()+"-"+todaysDate.getMonth().toString()+"-"+todaysDate.getDate().toString();
    const habit = await Habit.findById(id);

    let status = habit.days[todaysDay];

    if (status == "none") {
      habit.days.set(todaysDay, "yes");
      habit.completedCount = habit.completedCount + 1;
      // const presentDate = LocalDate.now();
      // habit.LastDoneDate = presentDate.toString();
      habit.completedDates.push(today);
    } else if (status == "yes") {
      habit.days.set(todaysDay, "no");
      habit.completedCount--;
      // habit.completedDates.pull(today);
      await habit.save();
      let arr = habit.completedDates;
      let LastDoneDate;
      if (arr.length == 0) {
        LastDoneDate = "0";
      } else {
        LastDoneDate = habit.completedDates[arr.length - 1];
      }
      habit.LastDoneDate = LastDoneDate;
      // habit.longestStreak = longestStreakCalculator(arr, arr.length);
    } else {
      habit.days.set(todaysDay, "none");
    }
    
    let arr = habit.completedDates;
    const highestStreak = longestStreakCalculator(arr, arr.length);
    habit.longestStreak = highestStreak;
    // Saving the changes made above to habit.
    const updatedHabit = await habit.save();
    // return res.send(updatedHabit);
    return res.redirect("back");
  } catch (error) {
    console.log("Error");
    return;
  }
};

// Function for calculating the highest number of streak
function longestStreakCalculator(arr, n) {
  if(n == 1 || n == 0){
    return n;
  }

  arr.sort();
  let longestStreak = 1;
  let currentStreak = 1;
  for (let i = 0; i < n - 1; i++) {

    if (getNumberOfDays(arr[i], arr[i+1]) === 1) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 1;
    }
  }
  return longestStreak;
}

// Function to calculate number of days between two dates.
function getNumberOfDays(start, end) {
  start = start.split('/');
  end = end.split('/');

  let temp = start[0];
  start[0] = start[1];
  start[1] = temp;

  temp = end[0];
  end[0] = end[1];
  end[1] = temp;

  start.join('/');
  end.join('/');

  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
}