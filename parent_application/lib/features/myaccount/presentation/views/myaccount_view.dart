import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:parent_application/features/auth/presentaion/views/login_page.dart'; // Ensure the correct path
import 'package:parent_application/features/myaccount/presentation/views/EditMyAccountView.dart';
import 'package:parent_application/core/utils/app_colors.dart'; // Make sure AppColors is imported

class MyaccountView extends StatelessWidget {
  // Removed `const` keyword since storage is non-constant
  MyaccountView({super.key});

  // Secure storage for token management
  final storage = FlutterSecureStorage();

  // Function to handle user logout
  Future<void> handleLogout(BuildContext context) async {
    // Show the verification dialog
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: AppColors.primaryColor, // Set background color
          title: Text(
            "تأكيد تسجيل الخروج",
            style: TextStyle(
              color: AppColors.sColor, // Set title text color to sColor
            ),
            textAlign: TextAlign.right, // Align the title text to the right
          ),
          content: Text(
            "هل أنت متأكد أنك تريد تسجيل الخروج؟",
            style: TextStyle(
              color: AppColors.sColor, // Set content text color to sColor
            ),
            textAlign: TextAlign.right, // Align the content text to the right
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text(
                "إلغاء",
                style: TextStyle(
                  color: AppColors.sColor, // Set text color for 'إلغاء' button
                ),
              ),
            ),
            TextButton(
              onPressed: () async {
                // Log out the user
                await FirebaseAuth.instance.signOut();
                await storage.delete(key: 'firebaseToken'); // Delete the token
                print("User logged out and token deleted.");

                // Navigate to login page after logging out
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => LoginPage()),
                );
              },
              child: Text(
                "موافق",
                style: TextStyle(
                  color: AppColors.sColor, // Set text color for 'موافق' button
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "الملف الشخصي",
          textDirection: TextDirection.rtl,
        ),
        centerTitle: true, // This centers the title
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(4),
          child: Column(
            children: [
              // Profile Picture with Pencil Icon Overlay
              Stack(
                children: [
                  SizedBox(
                    width: 120,
                    height: 120,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(100),
                      child: Image.asset('assets/images/profilephoto1.png'),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: GestureDetector(
                      onTap: () {
                        // Navigate to the EditMyAccount page
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const EditMyAccount(),
                          ),
                        );
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.thColor, // Apply thColor here
                        ),
                        padding: const EdgeInsets.all(4.0),
                        child: const Icon(
                          Icons.edit,
                          size: 20,
                          color: Colors.white, // Keep the icon white
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              // Profile name and number
              Column(
                children: [
                  Text(
                    "نورة",
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 24,
                        ),
                  ),
                  const SizedBox(
                      height: 5), // Add spacing between name and number
                  Text(
                    "+966123456789", // Phone number
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w400,
                          fontSize: 16,
                        ),
                  ),
                ],
              ),
              const SizedBox(height: 20), // Removed the email as requested

              // تعديل button to navigate to EditMyAccount page
              SizedBox(
                width: 200,
                child: ElevatedButton(
                  onPressed: () {
                    // Navigate to the EditMyAccount page
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const EditMyAccount(),
                      ),
                    );
                  },
                  child: const Text("تعديل"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.thColor, // Apply thColor here
                    foregroundColor: Colors.white,
                    textStyle: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 30),
              const Divider(),
              const SizedBox(height: 10),
              // Menu items
              myaccountMenuWidget(
                title: "تسجيل خروج",
                icon: Icons.exit_to_app,
                textColor: Colors.red,
                endIcon: false,
                onPressed: () {
                  handleLogout(context); // Call logout function
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Widget for account menu
class myaccountMenuWidget extends StatelessWidget {
  const myaccountMenuWidget({
    Key? key,
    required this.title,
    required this.icon,
    required this.onPressed,
    this.endIcon = true,
    this.textColor,
  }) : super(key: key);

  final String title;
  final IconData icon;
  final VoidCallback onPressed;
  final bool endIcon;
  final Color? textColor;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end, // Align to the right
          children: [
            Text(
              title,
              style: Theme.of(context)
                  .textTheme
                  .bodyLarge
                  ?.copyWith(color: textColor),
            ),
            const SizedBox(width: 10),
            Icon(
              icon,
              color: textColor ?? Colors.black,
            ),
          ],
        ),
      ),
    );
  }
}
