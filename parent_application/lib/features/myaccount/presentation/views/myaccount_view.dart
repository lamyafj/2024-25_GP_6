import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:parent_application/features/auth/presentaion/views/login_page.dart';
import 'package:parent_application/features/myaccount/presentation/views/EditMyAccountView.dart';
import 'package:parent_application/core/utils/app_colors.dart';

class MyaccountView extends StatefulWidget {
  @override
  _MyaccountViewState createState() => _MyaccountViewState();
}

class _MyaccountViewState extends State<MyaccountView> {
  bool isLoading = true; // Loading state to show a loading spinner
  String name = 'لايوجد اسم'; // Placeholder for name
  String phoneNumber = 'لا يوجد رقم'; // Placeholder for phone number
  final storage = FlutterSecureStorage(); // Initialize the storage instance

  String? uid; // National ID

  @override
  void initState() {
    super.initState();
    fetchUserData(); // Fetch user data on initialization
  }

  // Function to fetch user data from Firestore
  Future<void> fetchUserData() async {
    uid = await storage.read(key: 'nationalID');
    print("Fetched National ID from storage: $uid");
    try {
      DocumentSnapshot snapshot = await FirebaseFirestore.instance
          .collection('Parent') // Ensure this matches your Firestore structure
          .doc(uid) // Fetch data using the national ID
          .get();
print(snapshot.data());

      if (snapshot.exists) {
        if (mounted) {
          setState(() {
            name = snapshot['name'] ?? 'لايوجد اسم'; // Get name from document
            phoneNumber =
                snapshot['phoneNumber'] ?? 'لا يوجد رقم'; // Get phone number
            isLoading = false; // Set loading to false
          });
          print("Fetched data: $name, $phoneNumber"); // Log the fetched data
        }
      } else {
        print(
            "Document does not exist for National ID: $uid"); // Log if document doesn't exist
        if (mounted) {
          setState(() {
            isLoading = false; // Set loading to false if document doesn't exist
          });
        }
      }
    } catch (e) {
      print("Error fetching user data: $e"); // Log the error
      if (mounted) {
        setState(() {
          isLoading = false; // Set loading to false on error
        });
      }
    }
  }

  // Function to handle user logout
  Future<void> handleLogout(BuildContext context) async {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: AppColors.primaryColor,
          title: Text(
            "تأكيد تسجيل الخروج",
            style: TextStyle(color: AppColors.sColor, fontFamily: "zain"),
            textAlign: TextAlign.right,
          ),
          content: Text(
            "هل أنت متأكد أنك تريد تسجيل الخروج؟",
            style: TextStyle(
              color: AppColors.sColor,
              fontFamily: "zain",
            ),
            textAlign: TextAlign.right,
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text(
                "إلغاء",
                style: TextStyle(color: AppColors.sColor, fontFamily: "zain"),
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
                style: TextStyle(color: AppColors.sColor, fontFamily: "zain"),
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
        centerTitle: true, // Center the title
      ),
      body: isLoading
          ? Center(
              child: CircularProgressIndicator(
                color: Color.fromRGBO(196, 174, 87, 1.0),
              ),
            )
          : SingleChildScrollView(
              child: Container(
                padding: const EdgeInsets.all(4),
                child: Column(
                  children: [
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
                                    currentName: name,
                                    currentPhoneNumber: phoneNumber,
                                  ),
                                ),
                              );
                            },
                            child: Container(
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: AppColors.thColor,
                              ),
                              padding: const EdgeInsets.all(4.0),
                              child: const Icon(
                                Icons.edit,
                                size: 20,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Column(
                      children: [
                        Text(
                          name,
                          style:
                              Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 24,
                                  ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          phoneNumber,
                          style:
                              Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    fontWeight: FontWeight.w400,
                                    fontSize: 16,
                                  ),
                        ),
                      ],
                    ),
                    SizedBox(
                      width: 200,
                      child: ElevatedButton(
                        onPressed: () {
                          // Navigate to the EditMyAccount page
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => EditMyAccount(
                                currentName: name,
                                currentPhoneNumber: phoneNumber,
                              ),
                            ),
                          );
                        },
                        child: const Text("تعديل"),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.thColor,
                          foregroundColor: Colors.white,
                          textStyle:
                              const TextStyle(fontSize: 18, fontFamily: "zain"),
                        ),
                      ),
                    ),
                    const SizedBox(height: 30),
                    const Divider(),
                    const SizedBox(height: 10),
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
          mainAxisAlignment: MainAxisAlignment.end,
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