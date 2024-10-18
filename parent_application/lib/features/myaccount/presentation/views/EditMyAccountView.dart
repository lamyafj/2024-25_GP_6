import 'package:flutter/material.dart';
import 'package:parent_application/core/utils/app_colors.dart';
import 'package:flutter/services.dart';

class EditMyAccount extends StatelessWidget {
  final String currentName;
  final String currentPhoneNumber;

  const EditMyAccount({
    Key? key,
    required this.currentName,
    required this.currentPhoneNumber,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false, // Remove default back button
        actions: [
          // Add a custom back button to the right
          IconButton(
            icon: const Icon(Icons.keyboard_arrow_right),
            onPressed: () {
              Navigator.of(context).pop(); // Handle back navigation
            },
          ),
        ],
        title: const Text(
          "تعديل الملف الشخصي",
          textAlign: TextAlign.center,
        ),
        centerTitle: true, // Center the title
      ),
      body: Directionality(
        textDirection: TextDirection.rtl, // Set RTL layout
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                // Profile Picture Section
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
                // Full Name Field
                buildTextField(
                  labelText: 'الاسم',
                  icon: Icons.person,
                  initialValue: currentName,
                ),
                const SizedBox(height: 10),

                // Phone Number Field
                buildPhoneNumberField(
                  labelText: 'رقم الجوال',
                  icon: Icons.phone,
                  initialValue: currentPhoneNumber,
                ),
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
