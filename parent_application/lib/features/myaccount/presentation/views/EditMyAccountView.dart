import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:parent_application/core/utils/app_colors.dart';
import 'package:parent_application/features/myaccount/presentation/views/myaccount_view.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:parent_application/features/auth/presentaion/views/login_page.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart'; // Add secure storage package

class EditMyAccount extends StatefulWidget {
  final String currentName;
  final String currentPhoneNumber;

  const EditMyAccount({
    Key? key,
    required this.currentName,
    required this.currentPhoneNumber,
  }) : super(key: key);

  @override
  _EditMyAccountState createState() => _EditMyAccountState();
}

class _EditMyAccountState extends State<EditMyAccount> {
  late String newName;
  late String newPhoneNumber;
  final storage = FlutterSecureStorage(); // Instance of secure storage

  late TextEditingController _nameController;
  late TextEditingController _phoneController;

  @override
  void initState() {
    super.initState();
    newName = widget.currentName;
    newPhoneNumber = widget.currentPhoneNumber.replaceFirst('+966', '');
    _nameController = TextEditingController(text: newName);
    _phoneController = TextEditingController(text: newPhoneNumber);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.keyboard_arrow_right),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
        ],
        title: const Text(
          "تعديل الملف الشخصي",
          textAlign: TextAlign.center,
          style: TextStyle(
            fontFamily: "Zain", // Apply custom font
          ),
        ),
        centerTitle: true,
      ),
      body: Directionality(
        textDirection: TextDirection.rtl,
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Center(
                  child: Stack(
                    children: [
                      const CircleAvatar(
                        radius: 50,
                        backgroundColor: Colors.transparent,
                        backgroundImage:
                            AssetImage('assets/images/profilephoto1.png'),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                _buildNameField(),
                const SizedBox(height: 15),
                _buildPhoneNumberField(),
                const SizedBox(height: 20),
                _buildSaveButton(),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Define the _buildNameField method
  Widget _buildNameField() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Expanded(
          flex: 2,
          child: TextField(
            controller: _nameController,
            onChanged: (value) {
              setState(() {
                newName = value;
              });
            },
            textAlign: TextAlign.right,
            decoration: InputDecoration(
              labelText: 'الاسم',
              labelStyle: const TextStyle(fontSize: 16, color: Colors.grey),
              prefixIcon: const Icon(Icons.person),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              contentPadding:
                  const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            ),
          ),
        ),
      ],
    );
  }

  // Define the _buildPhoneNumberField method
  Widget _buildPhoneNumberField() {
    return Row(
      children: [
        Expanded(
          flex: 2,
          child: TextField(
            controller: _phoneController,
            keyboardType: TextInputType.phone,
            inputFormatters: [
              FilteringTextInputFormatter.digitsOnly,
              LengthLimitingTextInputFormatter(9),
            ],
            onChanged: (value) {
              setState(() {
                newPhoneNumber = value;
              });
            },
            textAlign: TextAlign.left,
            decoration: InputDecoration(
              labelText: 'رقم الجوال',
              labelStyle: const TextStyle(fontSize: 16, color: Colors.grey),
              prefixIcon: const Icon(Icons.phone),
              prefixText: '966+ ',
              prefixStyle: const TextStyle(fontSize: 16, color: Colors.black),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              contentPadding:
                  const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
            ),
          ),
        ),
      ],
    );
  }

  // Define the _buildSaveButton method
  Widget _buildSaveButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: _onSavePressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.thColor,
          foregroundColor: Colors.white,
        ),
        child: const Text(
          'حفظ التعديلات',
          style: TextStyle(fontSize: 18),
        ),
      ),
    );
  }

  Future<void> _onSavePressed() async {
    if (_validateInputs()) return;

    String updatedPhoneNumber = '+966$newPhoneNumber';
    String oldPhoneNumber = widget.currentPhoneNumber;

    if (!_isPhoneNumberValid(newPhoneNumber)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(
            child: Text(
              'رقم الجوال يجب أن يبدأ بـ 5 ويحتوي على 9 أرقام',
              textAlign: TextAlign.center,
            ),
          ),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    bool phoneNumberChanged = updatedPhoneNumber != oldPhoneNumber;

    if (phoneNumberChanged && await _checkPhoneNumberExists(updatedPhoneNumber))
      return;

    if (phoneNumberChanged) {
      _showConfirmationDialog(updatedPhoneNumber, oldPhoneNumber);
    } else {
      await _updatePhoneNumber(oldPhoneNumber, oldPhoneNumber);
      Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => MyaccountView()));
    }
  }

  bool _isPhoneNumberValid(String phoneNumber) {
    return phoneNumber.startsWith('5') && phoneNumber.length == 9;
  }

  bool _validateInputs() {
    if (newName == widget.currentName &&
        newPhoneNumber == widget.currentPhoneNumber.replaceFirst('+966', '')) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(
            child: Text(
              'لم يتم إجراء أي تغييرات',
              textAlign: TextAlign.center,
            ),
          ),
          backgroundColor: Colors.orange,
        ),
      );
      return true;
    }
    return false;
  }

  Future<bool> _checkPhoneNumberExists(String phoneNumber) async {
    try {
      FirebaseFirestore firestore = FirebaseFirestore.instance;
      var snapshot =
          await firestore.collection('Parent').doc(phoneNumber).get();
      if (snapshot.exists) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Center(
              child: Text(
                'رقم الجوال مستخدم بالفعل، يرجى استخدام رقم آخر',
                textAlign: TextAlign.center,
              ),
            ),
            backgroundColor: Colors.red,
          ),
        );
        return true;
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(
            child: Text(
              'خطأ: $e',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.black87),
            ),
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
    return false;
  }

  void _showConfirmationDialog(
      String updatedPhoneNumber, String oldPhoneNumber) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: AppColors.primaryColor, // Set the background color
          title: Text(
            'تأكيد تعديل رقم الجوال',
            style: TextStyle(
              color: AppColors.sColor, // Set the text color
            ),
            textAlign: TextAlign.center, // Align title to center
          ),
          content: Text(
            'هل أنت متأكد من تعديل رقم الجوال؟',
            style: TextStyle(
              color: AppColors.sColor, // Set the text color
            ),
            textAlign: TextAlign.center, // Align content to center
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text(
                'إلغاء',
                style: TextStyle(
                  color: AppColors.sColor, // Set the text color for "إلغاء"
                ),
              ),
            ),
            TextButton(
              onPressed: () async {
                // Show loading indicator
                showDialog(
                  context: context,
                  barrierDismissible: false,
                  builder: (BuildContext context) {
                    return const Center(
                      child: CircularProgressIndicator(),
                    );
                  },
                );

                try {
                  // First, update the phone number in Firestore
                  FirebaseFirestore firestore = FirebaseFirestore.instance;

                  // If the phone number has changed, delete the old one and save the new one
                  if (updatedPhoneNumber != oldPhoneNumber) {
                    await firestore
                        .collection('Parent')
                        .doc(oldPhoneNumber)
                        .delete(); // Delete the old phone number
                    await firestore
                        .collection('Parent')
                        .doc(updatedPhoneNumber)
                        .set({
                      'name': newName,
                      'phoneNumber': updatedPhoneNumber,
                      'children': [] // Include an empty children array
                    });
                  } else {
                    // If the phone number hasn't changed, just update the name
                    await firestore
                        .collection('Parent')
                        .doc(oldPhoneNumber)
                        .update({
                      'name': newName,
                    });
                  }

                  // After updating, log the user out
                  await FirebaseAuth.instance.signOut();
                  await storage.delete(
                      key: 'firebaseToken'); // Delete the token
                  print("User logged out and token deleted.");

                  // Navigate to login page after logging out
                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (context) => LoginPage()),
                  );
                } catch (e) {
                  Navigator.of(context).pop(); // Dismiss the loading indicator
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'خطأ: $e',
                        textAlign: TextAlign.center,
                      ),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              child: Text(
                "موافق",
                style: TextStyle(
                  color: AppColors.sColor, // Set the text color for 'موافق'
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  // Add the missing _updatePhoneNumber method here
  Future<void> _updatePhoneNumber(
      String updatedPhoneNumber, String oldPhoneNumber) async {
    try {
      FirebaseFirestore firestore = FirebaseFirestore.instance;

      // Step 1: Retrieve the old document
      DocumentSnapshot<Map<String, dynamic>> oldDocument =
          await firestore.collection('Parent').doc(oldPhoneNumber).get();

      // Step 2: Log the full contents of the old document
      if (oldDocument.exists) {
        print(
            "Old Document Data: ${oldDocument.data()}"); // Log the data for debugging
      } else {
        print("Old document with phone number $oldPhoneNumber does not exist.");
        return;
      }

      // Step 3: Extract and log the children field from the old document
      List<dynamic> children = oldDocument.data()?['children'] ?? [];
      print("Retrieved children array: $children");

      // Step 4: Handle phone number update
      if (updatedPhoneNumber != oldPhoneNumber) {
        // Step 5: Delete the old document
        await firestore.collection('Parent').doc(oldPhoneNumber).delete();

        // Step 6: Create a new document with the updated phone number
        await firestore.collection('Parent').doc(updatedPhoneNumber).set({
          'name': newName,
          'phoneNumber': updatedPhoneNumber,
          'children':
              children, // Include the children array in the new document
        });

        print("New document created with updated phone number and children.");
      } else {
        // If phone number hasn't changed, just update the name and children
        await firestore.collection('Parent').doc(oldPhoneNumber).update({
          'name': newName,
          'children': children, // Ensure children are still included
        });

        print("Document updated with new name and children.");
      }

      // Step 7: Confirm update success
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(
            child: Text(
              'تم التحديث بنجاح',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.black87),
            ),
          ),
          backgroundColor: AppColors.primaryColor,
          duration: const Duration(seconds: 4),
        ),
      );

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => MyaccountView()),
      );
    } catch (e) {
      print("Error occurred: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(
            child: Text(
              'خطأ: لم يتم تحديث البيانات: $e',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.black87),
            ),
          ),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 4),
        ),
      );
    }
  }
}
