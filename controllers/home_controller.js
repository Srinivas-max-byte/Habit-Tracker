const Habit = require("../models/habit.js");
const JSJoda = require("js-joda");
const LocalDate = JSJoda.LocalDate;

// Display all Habits when page loads.
module.exports.home = async function (req, res) {
  try {
    const date = new Date();
    let day = date.getDay();
    let allHabits = await Habit.find({});

    for (let habit of allHabits) {
      habit.days.set(day, "none");
      await habit.save();
      console.log(habit);
    }
    
    
    allHabits = await Habit.find({});
    res.send(allHabits);
    // return res.render("Home", {
    //   title: "Habit Tracker",
    //   habitsList: allHabits,
    // });
  } catch (err) {
    console.log("Error in fetching the habits");
  }
};

// Controller to create a habit.
module.exports.createHabit = async function (req, res) {
  try {
    let days = ["none", "none", "none", "none", "none", "none", "none"];
    let completedDates = [];
    console.log(req.body.description)
    console.log(req.body.time)
    const newHabit = new Habit({
      description: req.body.description,
      time: req.body.time,
      completedDates: completedDates,
      days: days,
    });
    console.log(newHabit)
    await newHabit.save();
    res.send(newHabit);
  } catch (error) {
    console.log("Error in creating habit");
  }
};

// Controller to delete a habit.
module.exports.deleteHabit = async function (req, res) {
  try {
    let id = req.query.id;
    const delResponse = await Habit.findByIdAndDelete(id);
    return res.send("Deleted");
    // return res.redirect("back");
  } catch (error) {
    console.log("Error in deleting Habit");
  }
};

// Controller to favourite a habit.
module.exports.favouriteHabit = async function (req, res) {
  try {
    let id = req.query.id;
    let favHabit = await Habit.findById(id);
    favHabit.isFav = !favHabit.isFav;
    await favHabit.save();
    return res.send("Fav Toggled");
    // return res.redirect("back");
  } catch (error) {
    console.log("Error");
  }
};

// Controller for toggling status.
module.exports.toggleStatus = async function (req, res) {
  try {
    let id = req.query.id;
    const habit = await Habit.findById(id);
    const todaysDate = new Date();
    const todaysDay = todaysDate.getDay();
    let status = habit.days[todaysDay];

    if (status == "none") {
      habit.days.set(todayDay, "yes");
      habit.completedCount++;
      const presentDate = LocalDate.now();

      if(habit.LastDoneDate == "0"){
        habit.currentStreak = 1;
        habit.longestStreak = 1;
      }
      else{
        const endDate = LocalDate.parse(habit.LastDoneDate);
        const noOfDays = JSJoda.ChronoUnit.DAYS.between(presentDate, endDate);
        if (noOfDays === 1) {
          habit.currentStreak = habit.currentStreak + 1;
          if (habit.currentStreak > habit.longestStreak) {
            habit.longestStreak = habit.currentStreak;
          }
        } else {
          habit.currentStreak = 1;
        }
      }
      habit.LastDoneDate = presentDate.toString();
      habit.completedDates.push(presentDate.toString());
    } else if (status == "yes") {
      habit.days.todayDay = "no";
      habit.completedCount--;
      habit.completedDates.pop();
      let arr = habit.completedDates;
      const LastDoneDate = habit.completedDates[arr.length - 1];
      habit.LastDoneDate = LastDoneDate;
    } else {
      habit.days.todayDay = "none";
    }
    let arr = habit.completedDates;
    const highestStreak = longestStreakCalculator(
      arr,
      arr.length
    );
    habit.longestStreak = highestStreak;
    // Saving the changes made above to habit.
    await habit.save();
    return;
  } catch (error) {
    console.log("Error");
    return;
  }
};

// Function for calculating the highest number of streak
function longestStreakCalculator(arr, n) {
  arr.sort();
  let longestCount = 0;
  let currentCount = 0;
  for (let i = 0; i < n; i++) {
    let first = LocalDate.parse(arr[i]);
    let second = LocalDate.parse(arr[i+1]);
    if (JSJoda.ChronoUnit.DAYS.between(first, second) === 1) {
      currentCount++;
      if (currentCount > longestCount) {
        longestCount = currentCount;
      }
    } else {
      currentCount = 0;
    }
  }
  return longestStreak;
}
