import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:parent_application/core/utils/app_colors.dart';
import 'package:parent_application/features/addmychild/presentation/views/addmychild_view.dart';
import 'package:parent_application/features/home/presentation/widgets/LiveLocationView.dart';
import 'child_service.dart'; // Import your ChildService
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class HomeView extends StatefulWidget {
  const HomeView({super.key});

  @override
  _HomeViewState createState() => _HomeViewState();
}


class _HomeViewState extends State<HomeView> {
  late Future<List<dynamic>> childrenFuture;
  final ChildService childService = ChildService();
  final storage = const FlutterSecureStorage();

  @override
  void initState() {
    super.initState();
    childrenFuture = Future.value([]); // Initialize the Future
    _loadChildrenData();
  }

  // Load children data from the service
  void _loadChildrenData() async {
    String? idToken = await storage.read(key: 'firebaseToken'); // Get the token
    print('Fetched idToken: $idToken'); // Log the token for debugging

    if (idToken != null) {
      try {
        setState(() {
          childrenFuture = childService.fetchChildren(idToken); // Fetch children with token
        });
      } catch (error) {
        _showErrorSnackbar('Error loading children: $error');
      }
    } else {
      setState(() {
        childrenFuture = Future.error('Missing idToken');
      });
      _showErrorSnackbar('Authentication error: No token found.');
    }
  }

  // This function will refresh the children list when a new child is added
  void _onChildAdded() {
    _loadChildrenData(); // Refresh the data
  }

  // Show a snackbar for errors
  void _showErrorSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, textDirection: TextDirection.rtl),
        duration: const Duration(seconds: 2),
        backgroundColor: Colors.redAccent,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "الصفحة الرئيسية",
          textDirection: TextDirection.rtl,
        ),
        centerTitle: true,
      ),
      body: FutureBuilder<List<dynamic>>(
        future: childrenFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'فشل في تحميل الأبناء',
                    textDirection: TextDirection.rtl,
                    style: TextStyle(color: Colors.red, fontSize: 18),
                  ),
                  ElevatedButton(
                    onPressed: _loadChildrenData,
                    child: const Text('حاول مرة أخرى',
                        textDirection: TextDirection.rtl),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.thColor,
                    ),
                  ),
                ],
              ),
            );
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text('لا يوجد أبناء مسجلين',
                  textDirection: TextDirection.rtl),
            );
          }

          final children = snapshot.data!;
          final activeChildren =
              children.where((child) => child['status'] == 'active').toList();
          final inactiveChildren =
              children.where((child) => child['status'] == 'inactive').toList();

          return ListView(
            children: [
              // Active children section
              if (activeChildren.isNotEmpty)
                ...activeChildren.map((child) => buildEventCard(
                      child: child,
                      title: child['studentFirstName'] ?? 'بدون اسم',
                      status: child['status'] ?? 'غير معروف',
                      context: context,
                      isInactive: false,
                    )),

              // Inactive children section
              if (inactiveChildren.isNotEmpty) ...[
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16.0),
                  child: Row(
                    children: <Widget>[
                      Expanded(
                        child: Divider(
                          color: Colors.grey, // Line color
                          thickness: 1, // Line thickness
                        ),
                      ),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8.0),
                        child: Text(
                          'قيد المراجعة',
                          style: TextStyle(
                            fontSize: 16,
                            fontFamily: 'Zain',
                            fontWeight: FontWeight.bold,
                            color: Colors.grey,
                          ),
                          textDirection: TextDirection.rtl,
                        ),
                      ),
                      Expanded(
                        child: Divider(
                          color: Colors.grey, // Line color
                          thickness: 1, // Line thickness
                        ),
                      ),
                    ],
                  ),
                ),
                ...inactiveChildren.map((child) => buildEventCard(
                      child: child,
                      title: child['studentFirstName'] ?? 'بدون اسم',
                      status: child['status'] ?? 'غير معروف',
                      context: context,
                      isInactive: true, // Mark as inactive
                    )),
              ],
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Use Navigator.push and wait for the result from the AddChildView
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddmychildView()),
          ).then((value) {
            if (value == true) {
              print('hii');
              _onChildAdded(); // If a child was added, refresh the list
            }
          });
        },
        backgroundColor: Colors.white,
        child: const Icon(Icons.add, color: Colors.black),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }

  Widget buildEventCard({
    required dynamic child,
    required String title,
    required String status,
    required BuildContext context,
    required bool isInactive, // New parameter to identify inactive children
  }) {
    // Combine first and family name
    final String fullName =
        "${child['studentFirstName']} ${child['studentFamilyName']}";

    return GestureDetector(
      onTap: isInactive
          ? null // Disable tap for inactive children
          : () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => StudentDetailsView(studentData: child),
                ),
              ).then((value) {
                if (value == true) {
                  _loadChildrenData(); // Refresh the list after a student is deleted
                }
              });
            },
      child: Opacity(
        opacity: isInactive ? 0.5 : 1.0, // Reduce opacity for inactive children
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
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            fullName, // Display both first name and family name
                            style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: AppColors.sColor),
                            textDirection: TextDirection.rtl,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Helper to show the status in a snackbar
  void _showStatusSnackBar(
      BuildContext context, String label, Color labelColor) {
    String message = '';

    if (labelColor == Colors.green) {
      message = "الطالب داخل الحافلة";
    } else if (labelColor == Colors.red) {
      message = "انتظر لركوب الطالب الحافلة";
    } else {
      message = "جاري مراجعة الطلب";
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, textDirection: TextDirection.rtl),
        duration: const Duration(seconds: 2),
        backgroundColor: Colors.black54,
      ),
    );
  }

class StudentDetailsView extends StatelessWidget {
  final dynamic studentData; // Receive the student data
  const StudentDetailsView({super.key, required this.studentData});

  @override
  Widget build(BuildContext context) {
    // Combine first and family name, handle if fields are null
    final String fullName =
        "${studentData['studentFirstName'] ?? 'لا يوجد اسم'} ${studentData['studentFamilyName'] ?? ''}";

    // Safely extract the address fields with null checks
    final address = studentData['address'] ?? {};
    final String street = address['street'] ?? 'غير متوفر';
    final String district = address['district'] ?? 'غير متوفر';
    final String city = address['city'] ?? 'غير متوفر';
    final String postalCode = address['postalCode'] ?? 'غير متوفر';

    // Extract the bus number safely
    final String bus = studentData['bus'] ?? 'غير متوفر';
    final String grade = studentData['grade'] ?? 'غير متوفر';

    return Scaffold(
      backgroundColor: Colors.white, // Light background color
      appBar: AppBar(
        automaticallyImplyLeading: false, // Hide the default back button
        title: Text(studentData['studentFirstName'] ?? 'No Name'),
        centerTitle: true, // Center the title
        actions: [
          IconButton(
            icon: const Icon(Icons.keyboard_arrow_right),
            onPressed: () {
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          fullName, // Display full name
                          style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.black),
                          textAlign: TextAlign.right,
                        ),
                      ],
                    ),
                    const SizedBox(width: 16),
                    const CircleAvatar(
                      radius: 30,
                      backgroundImage:
                          AssetImage('assets/images/profilephoto1.png'),
                      backgroundColor: Colors.transparent,
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                const Divider(thickness: 1, color: Colors.grey),
                const SizedBox(height: 10),
                Text('الصف: $grade', // Display grade if available
                    style: const TextStyle(fontSize: 18, color: Colors.black87),
                    textAlign: TextAlign.right),
                const SizedBox(height: 10),
                // Custom Address Display with null checks
                Text(
                  'العنوان: $street, $district, $city - $postalCode',
                  style: const TextStyle(fontSize: 18, color: Colors.black87),
                  textAlign: TextAlign.right,
                ),
                const SizedBox(height: 10),
                Text(
                  'رقم الحافلة: $bus',
                  style: const TextStyle(fontSize: 18, color: Colors.black87),
                  textAlign: TextAlign.right,
                ),
                const SizedBox(height: 30),
                Align(
                  alignment: Alignment.center,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      _confirmCancelDialog(context);
                    },
                    label: const Text("إلغاء تسجيل الطالب",
                        style: TextStyle(fontSize: 18, color: Colors.white)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.thColor,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 10),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10)),
                    ),
                    icon: const Icon(Icons.cancel),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Confirmation dialog for cancellation
  void _confirmCancelDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: AppColors.primaryColor,
          title: Text(
            "إلغاء التسجيل",
            style: TextStyle(color: AppColors.sColor),
            textAlign: TextAlign.right,
          ),
          content: Text(
            "هل أنت متأكد من إلغاء تسجيل الطالب؟",
            style: TextStyle(color: AppColors.sColor),
            textAlign: TextAlign.right,
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog only
              },
              child: Text("إلغاء", style: TextStyle(color: AppColors.sColor)),
            ),
            TextButton(
              onPressed: () async {
                // Close the dialog first
                Navigator.of(context).pop();

                // Call the delete method and wait for the result
                bool success = await deleteStudent( studentData['uid']); // Make sure studentId is correct

                // Show a snack bar based on the result
                if (success) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('تم إلغاء التسجيل بنجاح!'),
                      backgroundColor: Colors.green,
                    ),
                  );

                  // Pop the StudentDetailsView and return true to indicate success
                  Navigator.of(context).pop(true);
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('حدث خطأ أثناء الإلغاء'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              child: Text("تأكيد", style: TextStyle(color: AppColors.sColor)),
            ),
          ],
        );
      },
    );
  }

  Future<bool> deleteStudent(String studentUid) async {
  const url = 'http://10.0.2.2:5000/api/deletestudent'; // Backend URL
    // Get the Firebase token from the current user
    String? idToken = await FirebaseAuth.instance.currentUser?.getIdToken();

    if (idToken == null) {
      print('Error: No token found');
      return false; // Return false if token is missing
    }

  try {
    final response = await http.post(
      Uri.parse(url),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $idToken', // Firebase ID token
      },
      body: jsonEncode({'uid': studentUid}),
    );

    if (response.statusCode == 200) {
      print('Student deleted successfully');
      return true; // Deletion successful
    } else {
      print('Failed to delete student: ${response.body}');
      return false; // Deletion failed
    }
  } catch (error) {
    print('Error deleting student: $error');
    return false; // Error occurred
  }
}

}


