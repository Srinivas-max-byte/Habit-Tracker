// const Habit = require("../models/habits");

// // module.exports.toggleStatus = async function(req, res){
// //   try {
    
// //   } catch (error) {
// //     console.log("Error");
// //     return;
// //   }
// // }


// // // Updating the database for the request
// // module.exports.updateHabit = function (req, res) {
// //   let id = req.query.id;
// //   // finding the habit
// //   Habit.findById(id, function (err, habit) {
// //     if (err) {
// //       console.log("not found");
// //       return;
// //     }
// //     var newHabit = habit;
// //     let day = req.query.day;
// //     let val = req.query.val;
// //     for (let prop in newHabit.days) {
// //       if (prop == day) {
// //         if (val == "none") {
// //           newHabit.days[day] = "yes";
// //           newHabit.streak++;
// //         } else if (val == "yes") {
// //           newHabit.days[day] = "no";
// //           newHabit.streak--;
// //         } else {
// //           newHabit.days[day] = "none";
// //         }
// //       }
// //     }
// //     // updating that found habit
// //     Habit.findByIdAndUpdate(id, newHabit, function (err, newCreatedHabit) {
// //       if (err) {
// //         console.log("Error in Updating");
// //         return;
// //       }
// //       return res.redirect("back");
// //     });
// //   });
// // };

