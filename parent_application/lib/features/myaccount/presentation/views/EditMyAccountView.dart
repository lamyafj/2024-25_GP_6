import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:parent_application/core/utils/app_colors.dart';
import 'package:parent_application/features/myaccount/presentation/views/myaccount_view.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:parent_application/features/auth/presentaion/views/login_page.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

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

    // If phone number has changed, show confirmation dialog
    if (phoneNumberChanged) {
      bool? confirmLogout = await showDialog<bool>(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text("تأكيد تعديل رقم الجوال"),
            content:
                Text("سيتم تسجيل خروجك, هل أنت متأكد من تعديل رقم الجوال؟"),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(false), // Cancel
                child: Text("إلغاء"),
              ),
              TextButton(
                onPressed: () => Navigator.of(context).pop(true), // Confirm
                child: Text("موافق"),
              ),
            ],
          );
        },
      );

      if (confirmLogout == true) {
        await FirebaseAuth.instance.signOut();
        await storage.delete(key: 'uid'); // Delete the UID
        print("User logged out and UID deleted.");

        // Update user data in Firestore after logging out
        String? uid =
            await storage.read(key: 'uid'); // Fetch UID from secure storage
        if (uid != null) {
          await _updateUserData(
              uid, newName, updatedPhoneNumber, oldPhoneNumber);
        }

        // Navigate to login page after logging out
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => LoginPage()),
        );
        return;
      } else {
        return; // User chose not to log out
      }
    }

    // Update the user's data in Firestore
    String? uid =
        await storage.read(key: 'uid'); // Fetch UID from secure storage

    if (uid != null) {
      await _updateUserData(uid, newName, updatedPhoneNumber, oldPhoneNumber);
      Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => MyaccountView()));
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(
            child: Text('خطأ في استرداد المعرف الخاص بالمستخدم'),
          ),
          backgroundColor: Colors.red,
        ),
      );
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

  Future<void> _updateUserData(String uid, String name,
      String updatedPhoneNumber, String oldPhoneNumber) async {
    try {
      FirebaseFirestore firestore = FirebaseFirestore.instance;

      // Step 1: Update the user data in Firestore
      await firestore.collection('Parent').doc(uid).update({
        'name': name,
        'phoneNumber': updatedPhoneNumber,
      });

      // Optionally, if you need to handle old phone number logic:
      if (oldPhoneNumber != updatedPhoneNumber) {
        // Additional logic if necessary
      }

      // Confirmation message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(
            child: Text('تم التحديث بنجاح'),
          ),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print("Error updating user data: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(
            child: Text('خطأ في تحديث البيانات: $e'),
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}