import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import 'package:parent_application/core/utils/app_colors.dart';

class EditMyAccount extends StatelessWidget {
  const EditMyAccount({super.key});

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
              crossAxisAlignment:
                  CrossAxisAlignment.end, // Align the column to the right
              children: [
                // Profile Picture Section
                Center(
                  child: Stack(
                    children: [
                      const CircleAvatar(
                        radius: 50,
                        backgroundColor: Colors
                            .transparent, // Make sure this matches the app's theme
                        backgroundImage:
                            AssetImage('assets/images/profilephoto1.png'),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: GestureDetector(
                          onTap: () {
                            // Handle profile picture change
                          },
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: AppColors.thColor,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.camera_alt,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                // Full Name Field
                buildTextField(
                  labelText: 'الاسم',
                  icon: Icons.person,
                ),
                const SizedBox(height: 10),

                // Phone Number Field
                buildPhoneNumberField(
                  labelText: 'رقم الجوال',
                  icon: Icons.phone,
                ),
                const SizedBox(height: 10),
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
                      'تعديل الملف',
                      style: TextStyle(fontSize: 18),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                // Join Date and Delete Button
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton(
                      onPressed: () {
                        // Handle delete account
                      },
                      child: const Text(
                        'إلغاء',
                        style: TextStyle(fontSize: 18, color: Colors.red),
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

  // Helper method for creating text fields
  Widget buildTextField({
    required String labelText,
    required IconData icon,
    bool isPassword = false,
  }) {
    return TextField(
      textAlign: TextAlign.right, // Align text input to the right
      obscureText: isPassword,
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
  }) {
    return TextField(
      textAlign: TextAlign.right, // Align text input to the right
      keyboardType: TextInputType.phone,
      inputFormatters: [
        FilteringTextInputFormatter.digitsOnly,
        LengthLimitingTextInputFormatter(9),
      ],
      decoration: InputDecoration(
        labelText: labelText,
        labelStyle: const TextStyle(
          fontSize: 16,
          color: Colors.grey,
        ),
        prefixText: '+966 ', // Add the +966 prefix
        prefixIcon: Icon(icon), // Icon on the left side in RTL layout
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        contentPadding:
            const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
      ),
      textDirection: TextDirection.rtl, // Ensure text direction is RTL
    );
  }
}
