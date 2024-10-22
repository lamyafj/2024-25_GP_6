import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:parent_application/core/utils/app_colors.dart';
import 'package:parent_application/features/myaccount/presentation/views/myaccount_view.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:parent_application/features/auth/presentaion/views/login_page.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';

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

    String? nationalId =
        await storage.read(key: 'nationalID'); // Fetch National ID

    if (nationalId != null) {
      // Check if only name was changed
      if (newName != widget.currentName &&
          newPhoneNumber ==
              widget.currentPhoneNumber.replaceFirst('+966', '')) {
        await _updateUserData(
            nationalId, newName, widget.currentPhoneNumber); // Update name only
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => MyaccountView()),
        );
      } else {
        // Check if number changed and needs validation
        bool isPhoneNumberChanged = newPhoneNumber !=
            widget.currentPhoneNumber.replaceFirst('+966', '');

        if (isPhoneNumberChanged) {
          bool phoneNumberExists =
              await _checkPhoneNumberExists(updatedPhoneNumber);

          if (phoneNumberExists) {
            // Show dialog to confirm update
            _showConfirmationDialog(
              onConfirm: () async {
                await _updateUserData(nationalId, newName,
                    updatedPhoneNumber); // Update both name and number
                _logOutUser(); // Log user out after updating phone number
              },
            );
          } else {
            // Proceed with update as phone number does not exist
            await _updateUserData(nationalId, newName, updatedPhoneNumber);
            _logOutUser();
          }
        } else {
          // If only name changed, update it
          await _updateUserData(nationalId, newName, widget.currentPhoneNumber);
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => MyaccountView()),
          );
        }
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(
            child: Text('خطأ في استرداد الهوية الوطنية'),
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<bool> _checkPhoneNumberExists(String phoneNumber) async {
    FirebaseFirestore firestore = FirebaseFirestore.instance;
    var query = await firestore
        .collection('Parent')
        .where('phoneNumber', isEqualTo: phoneNumber)
        .get();

    return query.docs.isNotEmpty;
  }

  void _showConfirmationDialog({required VoidCallback onConfirm}) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: AppColors.primaryColor, // Set the background color
          title: Text(
            'تأكيد',
            textAlign: TextAlign.center,
            style: TextStyle(color: AppColors.sColor, fontFamily: "Zain"),
          ),
          content: Text(
            'هل أنت متأكد من تغيير رقم الجوال؟ سيتم تسجيل الخروج بعد التأكيد.',
            textAlign: TextAlign.right,
            style: TextStyle(color: AppColors.sColor, fontFamily: "Zain"),
          ),
          actions: <Widget>[
            TextButton(
              child: Text(
                'إلغاء',
                style: TextStyle(color: AppColors.sColor, fontFamily: "Zain"),
              ),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text(
                'تأكيد',
                style: TextStyle(color: AppColors.sColor, fontFamily: "Zain"),
              ),
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
                onConfirm(); // Execute the confirmation action
              },
            ),
          ],
        );
      },
    );
  }

  void _logOutUser() {
    FirebaseAuth.instance.signOut().then((value) {
      GoRouter.of(context).go('/login'); // Navigate to the login page
    }).catchError((error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to log out: $error'),
          backgroundColor: Colors.red,
        ),
      );
    });
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

  Future<void> _updateUserData(
      String nationalId, String name, String updatedPhoneNumber) async {
    try {
      FirebaseFirestore firestore = FirebaseFirestore.instance;

      // Update the user data in Firestore using national ID
      await firestore.collection('Parent').doc(nationalId).update({
        'name': name,
        'phoneNumber': updatedPhoneNumber,
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(
            child: Text('تم التحديث بنجاح'),
          ),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
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
