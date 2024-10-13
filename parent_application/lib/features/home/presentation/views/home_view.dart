// import 'package:flutter/material.dart';

// class HomeView extends StatelessWidget {
//   const HomeView({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         title: const Text("الصفحة الرئيسية"),
//       ),
//       body: Padding(
//         padding: const EdgeInsets.all(16.0),
//         child: GridView.count(
//           crossAxisCount: 2, // Number of columns
//           crossAxisSpacing: 16.0,
//           mainAxisSpacing: 16.0,
//           children: [
//             // "Student Location" tile
//             buildGridTile(
//               icon: Icons.location_on,
//               label: "موقع الطالب",
//               onTap: () {},
//             ),
//             // "Student Status" tile
//             buildGridTile(
//               icon: Icons.assignment,
//               label: "حالة الطالب",
//               onTap: () {},
//             ),
//             // Empty Label tile
//             buildGridTile(
//               icon: Icons.calendar_today,
//               label: "",
//               onTap: () {},
//             ),
//             // Empty Label tile
//             buildGridTile(
//               icon: Icons.schedule,
//               label: "",
//               onTap: () {},
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget buildGridTile({required IconData icon, required String label, required VoidCallback onTap}) {
//     return InkWell(
//       onTap: onTap,
//       child: Container(
//         decoration: BoxDecoration(
//           color: const Color.fromARGB(255, 16, 91, 56), // Set the box color to #053A21
//           borderRadius: BorderRadius.circular(12),
//         ),
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             Icon(icon, size: 40, color: Colors.white),
//             const SizedBox(height: 10),
//             Text(
//               label,
//               textAlign: TextAlign.center,
//               style: const TextStyle(color: Colors.white, fontSize: 18),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:parent_application/core/utils/app_colors.dart';
import 'package:parent_application/features/addmychild/presentation/views/addmychild_view.dart';
import 'package:parent_application/features/home/presentation/widgets/LiveLocationView.dart';

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: const Text(
        "الصفحة الرئيسية",
        textDirection: TextDirection.rtl,
      ),
      centerTitle: true, // This centers the title
    ),
    body: SingleChildScrollView( // Wrap with SingleChildScrollView to prevent overflow
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end, // Align all elements to the right
          children: [
            Text(
              "الأبناء",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.sColor),
              textDirection: TextDirection.rtl, // Right-to-left text direction
            ),
            const SizedBox(height: 20),
            // First event card
            buildEventCard(
              title: "محمد", 
              time: "وقت الوصول المتوقع؟",
              location: "",
              label: "داخل الحافلة",
              labelColor: Colors.green,
              context: context,
            ),
            const SizedBox(height: 10),
            // Second event card
            buildEventCard(
              title: "سارة", 
              time: "12:30",
              location: "", 
              label: "خارج الحافلة",
              labelColor: Colors.red,
              context: context, 
            ),
          
            
            const SizedBox(height: 10),

            Row(
              children: const [
                Expanded(
                  child: Divider(
                    thickness: 1,
                    color: Colors.grey,
                    endIndent: 10, // Space between text and line
                  ),
                ),
                Text(
                  "قيد المراجعة",
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
                Expanded(
                  child: Divider(
                    thickness: 1,
                    color: Colors.grey,
                    indent: 10, // Space between text and line
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            // third event card 
            buildEventCard(
              title: "لينا", 
              time: "12:30",
              location: "", 
              label: "انتظار",
              labelColor: Colors.grey,
              context: context,
            ),
          ],
        ),
      ),
    ),
    floatingActionButton: FloatingActionButton(
      onPressed: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => const AddmychildView()),
        );
      },
      child: const Icon(Icons.add),
      backgroundColor: Colors.white,
    ),
    floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
  );
}

 Widget buildEventCard({
  required String title,
  required String time,
  required String location,
  required String label,
  required Color labelColor,
  required BuildContext context,
}) {
  return SizedBox(
    width: double.infinity, // Full width available
    height: 80, // Fixed height
    child: Container(
      padding: const EdgeInsets.all(8), // Padding for the card
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 2,
            blurRadius: 5,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center, // Center items vertically
        children: [
          // Event label, positioned on the left
          InkWell(
            onTap: () {
              if (labelColor == Colors.green) {
                // Navigate to live location page only if label is green
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const LiveLocationView(),
                  ),
                );
              } else if (labelColor == Colors.red) {
                // Show snackbar message if label is red
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text(
                      "انتظر لركوب الطالب الحافلة", // Message to show in snackbar
                      textDirection: TextDirection.rtl, // Right-to-left text direction
                    ),
                    duration: const Duration(seconds: 2), // Duration for snackbar display
                    behavior: SnackBarBehavior.floating, // Optional: make the snackbar float
                    backgroundColor: Colors.black54, // Optional: customize background color
                  ),
                );
              } else if (labelColor == Colors.grey) {
                // Show snackbar message if label is grey
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: const Text(
                      "جاري مراجعة الطلب", // Message for the grey label
                      textDirection: TextDirection.rtl, // Right-to-left text direction
                    ),
                    duration: const Duration(seconds: 2), // Duration for snackbar display
                    behavior: SnackBarBehavior.floating, // Optional: make the snackbar float
                    backgroundColor: Colors.black54, // Optional: customize background color
                  ),
                );
              }
            },
            child: Container(
              margin: const EdgeInsets.only(right: 8),
              padding: const EdgeInsets.symmetric(vertical: 2, horizontal: 6),
              decoration: BoxDecoration(
                color: labelColor.withOpacity(0.3),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                label.isNotEmpty ? label : "بدون تسمية",
                style: TextStyle(
                  color: labelColor,
                  fontSize: 12,// Increased font size for the label
                  fontWeight: FontWeight.bold,
                ),
                textDirection: TextDirection.rtl,
              ),
            ),
          ),
          // Left side for title, time, and location
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                // Event title
                Text(
                  title,
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.sColor),
                  textDirection: TextDirection.rtl,
                ),
                // Event time
                Text(
                  time,
                  style: const TextStyle(fontSize: 14),
                  textDirection: TextDirection.rtl,
                ),
                // Event location, only display if it's not empty
                if (location.isNotEmpty)
                  Text(
                    location,
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                    textDirection: TextDirection.rtl,
                  ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}
}
