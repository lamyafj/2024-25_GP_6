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
                textDirection: TextDirection.rtl,
              ),
              const SizedBox(height: 20),
              // First event card with green label automatically showing "تتبع الحافلة" button
              buildEventCard(
                title: "محمد",
                time: "وقت الوصول المتوقع؟",
                location: "",
                label: "داخل الحافلة",
                labelColor:
                    Colors.green, // Green label will show the follow button
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
                      endIndent: 10,
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
                      indent: 10,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              // Third event card
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
    // Automatically show the "تتبع الحافلة" button if the label is green
    bool showFollowButton = labelColor == Colors.green;

    return SizedBox(
      width: double.infinity, // Full width available
      height: 120, // Adjusted height to fit the button
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
                    padding:
                        const EdgeInsets.symmetric(vertical: 2, horizontal: 6),
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
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppColors.sColor),
                        textDirection: TextDirection.rtl,
                      ),
                      Text(
                        time,
                        style: const TextStyle(fontSize: 14),
                        textDirection: TextDirection.rtl,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            // Follow button, only shown if the label is green
            if (showFollowButton)
              Align(
                alignment: Alignment.centerLeft, // Align the button to the left
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
                    margin: const EdgeInsets.only(
                        top: 5), // Spacing between the buttons
                    padding:
                        const EdgeInsets.symmetric(vertical: 2, horizontal: 6),
                    decoration: BoxDecoration(
                      color: AppColors.fthColor
                          .withOpacity(0.3), // Use fthColor for button color
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      "تتبع الحافلة",
                      style: TextStyle(
                        color:
                            AppColors.fthColor, // Use fthColor for text color
                        fontSize: 12, // Matching font size
                        fontWeight: FontWeight.bold,
                      ),
                      textDirection: TextDirection.rtl,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
