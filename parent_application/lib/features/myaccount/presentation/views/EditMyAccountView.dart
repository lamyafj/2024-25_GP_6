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
                // Edit Profile Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      // Handle edit profile action
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.thColor,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text(
                      'حفظ التعديلات',
                      style: TextStyle(fontSize: 18),
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

  // Helper method for creating text fields
  Widget buildTextField({
    required String labelText,
    required IconData icon,
    required String initialValue,
    bool isPassword = false,
  }) {
    return TextField(
      textAlign: TextAlign.right, // Align text input to the right
      obscureText: isPassword,
      controller: TextEditingController(text: initialValue),
      decoration: InputDecoration(
        labelText: labelText,
        labelStyle: const TextStyle(
          fontSize: 16,
          color: Colors.grey,
        ),
        prefixIcon: Icon(icon), // Icon on the left side in RTL layout
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        contentPadding:
            const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
      ),
      textDirection: TextDirection.rtl, // Ensure text direction is RTL
    );
  }

  // Phone Number Field with +966 prefix and 9-digit validation
  Widget buildPhoneNumberField({
    required String labelText,
    required IconData icon,
    required String initialValue,
  }) {
    String formattedPhoneNumber =
        initialValue.startsWith('+966') ? initialValue : '+966' + initialValue;

    return TextField(
      textAlign: TextAlign.right, // Align text input to the right
      keyboardType: TextInputType.phone,
      controller: TextEditingController(text: formattedPhoneNumber),
      inputFormatters: [
        FilteringTextInputFormatter.digitsOnly,
        LengthLimitingTextInputFormatter(12), // Limit to 9 digits +966
      ],
      decoration: InputDecoration(
        labelText: labelText,
        labelStyle: const TextStyle(
          fontSize: 16,
          color: Colors.grey,
        ),
        prefixIcon: Icon(icon), // Icon on the left side in RTL layout
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        contentPadding:
            const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
      ),
      textDirection: TextDirection.rtl, // Ensure text direction is RTL
    );
  }
}
