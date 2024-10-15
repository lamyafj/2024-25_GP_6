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
      body: SingleChildScrollView(
        // Wrap with SingleChildScrollView to prevent overflow
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment.end, // Align all elements to the right
            children: [
              Text(
                "الأبناء",
                style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppColors.sColor),
                textDirection:
                    TextDirection.rtl, // Right-to-left text direction
              ),
              const SizedBox(height: 20),
              // First event card
              buildEventCard(
                title: "محمد",
                time: "",
                location: "",
                label: "داخل الحافلة",
                labelColor: Colors.green,
                context: context, // Pass context here
              ),
              const SizedBox(height: 10),
              // Second event card
              buildEventCard(
                title: "سارة",
                time: "",
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

              // z card
              buildEventCard(
                title: "لينا",
                time: "",
                location: "",
                label: "انتظار",
                labelColor: Colors.grey,
                context: context, // Pass context here
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
    // Automatically show the "تتبع الحافلة" button if the label is green
    bool showFollowButton = labelColor == Colors.green;

    return GestureDetector(
      onTap: () {
        // Navigate to the student details page when the card is tapped
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => StudentDetailsView(
                studentName: title), // Replace with your student details page
          ),
        );
      },
      child: SizedBox(
        width: double.infinity, // Full width available
        height: 120, // Increased height to accommodate all elements
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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Event label, positioned on the left
                  InkWell(
                    onTap: () {
                      if (labelColor == Colors.green) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Text(
                              " الطالب داخل الحافلة",
                              textDirection: TextDirection.rtl,
                            ),
                            duration: const Duration(seconds: 2),
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: Colors.black54,
                          ),
                        );
                      } else if (labelColor == Colors.red) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Text(
                              "انتظر لركوب الطالب الحافلة",
                              textDirection: TextDirection.rtl,
                            ),
                            duration: const Duration(seconds: 2),
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: Colors.black54,
                          ),
                        );
                      } else if (labelColor == Colors.grey) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: const Text(
                              "جاري مراجعة الطلب",
                              textDirection: TextDirection.rtl,
                            ),
                            duration: const Duration(seconds: 2),
                            behavior: SnackBarBehavior.floating,
                            backgroundColor: Colors.black54,
                          ),
                        );
                      }
                    },
                    child: Container(
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.symmetric(
                          vertical: 2, horizontal: 6),
                      decoration: BoxDecoration(
                        color: labelColor.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        label.isNotEmpty ? label : "بدون تسمية",
                        style: TextStyle(
                          color: labelColor,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                        textDirection: TextDirection.rtl,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          title,
                          style: TextStyle(
                            fontSize: 18, // Reduced font size
                            fontWeight: FontWeight.bold,
                            color: AppColors.sColor,
                          ),
                          textDirection: TextDirection.rtl,
                        ),
                        Text(
                          time,
                          style: const TextStyle(
                              fontSize: 12), // Reduced font size
                          textDirection: TextDirection.rtl,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8), // Space between rows
              // Follow button, only shown if the label is green
              if (showFollowButton)
                Align(
                  alignment:
                      Alignment.centerLeft, // Align the button to the left
                  child: InkWell(
                    onTap: () {
                      // Navigate to live location page
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const LiveLocationView(),
                        ),
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          vertical: 2, horizontal: 6),
                      child: Text(
                        "تتبع الحافلة",
                        style: TextStyle(
                          color:
                              AppColors.sColor, // Use fthColor for text color
                          fontSize: 13, // Reduced font size
                          fontWeight: FontWeight.bold,
                          decoration: TextDecoration.underline,
                        ),
                        textDirection: TextDirection.rtl,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}


class StudentDetailsView extends StatelessWidget {
  final String studentName;

  const StudentDetailsView({Key? key, required this.studentName})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // Light background color
      appBar: AppBar(
        automaticallyImplyLeading: false, // Hide the default back button
        title: Text(studentName),
        centerTitle: true, // Center the title
        actions: [
          IconButton(
            icon: const Icon(Icons.keyboard_arrow_right),
            onPressed: () {
              // Navigate back when the button is pressed
              Navigator.of(context).pop();
            },
          ),
        ],
      ),
      body: Center(
        child: Card(
          color: AppColors.primaryColor,
          margin: const EdgeInsets.all(16.0),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15.0), // Rounded corners
          ),
          elevation: 5,
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisSize:
                  MainAxisSize.min, // Minimize column height to content
              crossAxisAlignment:
                  CrossAxisAlignment.end, // Align text to the right
              children: [
                // Student Name and Picture
                Row(
                  mainAxisAlignment:
                      MainAxisAlignment.end, // Align to the right
                  children: [
                    Column(
                      crossAxisAlignment:
                          CrossAxisAlignment.end, // Align text to the right
                      children: [
                        Text(
                          'محمد خالد',
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                          textAlign: TextAlign.right,
                        ),
                        // const SizedBox(height: 4),
                        // Text(
                        //   'طالب بالصف الثاني المتوسط',
                        //   style: const TextStyle(
                        //     fontSize: 16,
                        //     color: Colors.black54,
                        //   ),
                        //   textAlign: TextAlign.right,
                        // ),
                      ],
                    ),
                    const SizedBox(
                        width: 16), // Spacing between text and picture
                    const CircleAvatar(
                      radius: 30,
                      backgroundImage: AssetImage(
                          'assets/images/profilephoto1.png'), // Replace with actual profile image
                      backgroundColor: Colors.transparent,
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                const Divider(
                  thickness: 1,
                  color: Colors.grey,
                ),
                const SizedBox(height: 10),

                // Student Details
                const Text(
                  'الصف: الرابع',
                  style: TextStyle(fontSize: 18, color: Colors.black87),
                  textAlign: TextAlign.right,
                ),
                const SizedBox(height: 10),
                const Text(
                  'العنوان: شارع الملك فيصل، الرياض',
                  style: TextStyle(fontSize: 18, color: Colors.black87),
                  textAlign: TextAlign.right,
                ),
                const SizedBox(height: 30),

                // Cancel Registration Button (Aligned Center)
                Align(
                  alignment: Alignment.center,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // Trigger cancel registration action
                      showDialog(
                        context: context,
                        builder: (BuildContext context) {
                          return AlertDialog(
                            backgroundColor: 
                                AppColors.primaryColor, // Set the background color to primaryColor
                            title: Text(
                              "إلغاء التسجيل",
                              style: TextStyle(
                                color: 
                                    AppColors.sColor, // Set text color to sColor
                              ),
                              textAlign: TextAlign
                                  .right, // Align the title text to the right
                            ),
                            content: Text(
                              "هل أنت متأكد من إلغاء تسجيل الطالب؟",
                              style: TextStyle(
                                color: 
                                    AppColors.sColor, // Set text color to sColor
                              ),
                              textAlign: TextAlign
                                  .right, // Align the content text to the right
                            ),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  Navigator.of(context)
                                      .pop(); // Close the dialog on 'إلغاء'
                                },
                                child: Text(
                                  "إلغاء",
                                  style: TextStyle(
                                    color: AppColors.sColor, // Text color for 'إلغاء' button
                                  ),
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.of(context).pop();
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('تم إلغاء التسجيل بنجاح!'),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                },
                                child: Text(
                                  "تأكيد",
                                  style: TextStyle(
                                    color: AppColors.sColor, // Text color for 'تأكيد' button
                                  ),
                                ),
                              ),
                            ],
                          );
                        },
                      );
                    },
                    // icon: const Icon(Icons.undo, color: Colors.white),
                    label: const Text(
                      "إلغاء  تسجيل الطالب",
                      style: TextStyle(fontSize: 18, color: Colors.white),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          AppColors.thColor, // Light red background
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 10),
                      shape: RoundedRectangleBorder(
                        borderRadius:
                            BorderRadius.circular(10), // Rounded corners
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
