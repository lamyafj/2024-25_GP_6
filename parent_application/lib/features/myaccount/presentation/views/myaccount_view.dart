import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // For decoding JSON
import 'package:parent_application/features/auth/presentaion/views/login_page.dart';
import 'package:parent_application/features/myaccount/presentation/views/EditMyAccountView.dart';
import 'package:parent_application/core/utils/app_colors.dart';

class MyaccountView extends StatefulWidget {
  @override
  _MyaccountViewState createState() => _MyaccountViewState();
}

class _MyaccountViewState extends State<MyaccountView> {
  bool isLoading = true; // Loading state to show a loading spinner
  String name = '...'; // Placeholder for name
  String phoneNumber = '...'; // Placeholder for phone number
  final storage =
      const FlutterSecureStorage(); // Secure storage for token management

  // Fetch user profile data from the Node.js server
  Future<void> fetchParentData() async {
    String? token =
        await storage.read(key: 'firebaseToken'); // Retrieve Firebase token
    String? userPhoneNumber = FirebaseAuth.instance.currentUser?.phoneNumber;

    if (token == null || userPhoneNumber == null) {
      print('Error: No token or phone number available');
      setState(() {
        isLoading = false; // Stop loading if there's an error
      });
      return;
    }

    try {
      // Replace with your Node.js server IP
      final response = await http.get(
        Uri.parse('http://10.0.2.2:5000/getParentData/$userPhoneNumber'),
        headers: {
          'Authorization': 'Bearer $token', // Send token in header if needed
          'Content-Type': 'application/json',
        },
      );

      print('Response: ${response.body}'); // Log the server response

      if (response.statusCode == 200) {
        // Successfully fetched parent data
        final data = json.decode(response.body);
        setState(() {
          name = data['name'] ?? 'No name found';
          phoneNumber = data['phoneNumber'] ?? 'No phone number found';
          isLoading = false; // Stop loading when data is fetched
        });
      } else {
        print('Error fetching parent data: ${response.statusCode}');
        setState(() {
          isLoading = false; // Stop loading on error
        });
      }
    } catch (e) {
      print('Error fetching parent data: $e');
      setState(() {
        isLoading = false; // Stop loading on exception
      });
    }
  }

  @override
  void initState() {
    super.initState();
    fetchParentData(); // Fetch parent data when the page is initialized
  }

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
              style: TextStyle(
      fontFamily: 'Zain',
    ),
        ),
        centerTitle: true, // This centers the title
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator()) // Show a loading spinner
          : SingleChildScrollView(
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
                            child:
                                Image.asset('assets/images/profilephoto1.png'),
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
                                  builder: (context) => EditMyAccount(
                                    currentName: name, // Pass current name
                                    currentPhoneNumber:
                                        phoneNumber, // Pass current phone number
                                  ),
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
                    // Profile name and phone number
                    Column(
                      children: [
                        Text(
                          name, // Display the name fetched from the server
                          style:
                              Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 24,
                                  ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          phoneNumber, // Display the phone number fetched from the server
                          style:
                              Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    fontWeight: FontWeight.w400,
                                    fontSize: 16,
                                  ),
                        ),
                      ],
                    ),
                    // تعديل button to navigate to EditMyAccount page
                    SizedBox(
                      width: 200,
                      child: ElevatedButton(
                        onPressed: () {
                          // Navigate to the EditMyAccount page
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => EditMyAccount(
                                currentName: name, // Pass the current name
                                currentPhoneNumber:
                                    phoneNumber, // Pass the current phone number
                              ),
                            ),
                          );
                        },
                        child: const Text("تعديل"),
                        style: ElevatedButton.styleFrom(
                          backgroundColor:
                              AppColors.thColor, // Apply thColor here
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
