import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:parent_application/core/utils/app_colors.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/services.dart'; // Import to use input formatters

class AddmychildView extends StatefulWidget {
  const AddmychildView({super.key});

  @override
  _AddMyChildViewState createState() => _AddMyChildViewState();
}

class _AddMyChildViewState extends State<AddmychildView> {
  bool isSubmitting = false;

  // Controllers for form fields
  final TextEditingController nationalIdController = TextEditingController();
  final TextEditingController schoolCodeController = TextEditingController();
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController parentPhoneController = TextEditingController();
  final TextEditingController cityController = TextEditingController();
  final TextEditingController districtController = TextEditingController();
  final TextEditingController streetController = TextEditingController();
  final TextEditingController postalCodeController = TextEditingController();
  final TextEditingController boradingStatusController =
      TextEditingController();
  final FlutterSecureStorage storage = FlutterSecureStorage(); // Secure storage instance for retrieving parent national ID

  String? selectedGrade;

  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.keyboard_arrow_right),
            onPressed: () {
              Navigator.of(context).pop(); // Navigate back when pressed
            },
          ),
          title: const Text(
            "تسجيل طالب في الحافلة",
            style: TextStyle(color: Color(0xFF01391F),fontFamily: 'Zain'),
          ),
          backgroundColor: Colors.white,
          iconTheme: const IconThemeData(color: Color(0xFF01391F)),
          centerTitle: true,
        ),
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                const Align(
                  alignment: Alignment.center,
                  child: Text(
                    "إضافة معلومات الطالب",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF01391F),
                      fontFamily: 'Zain'
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const SizedBox(height: 16),

                      // School Code Field with fixed "SH"
                      Row(
                        children: [
                          const Text(
                            'SH-',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: TextFormField(
                              controller: schoolCodeController,
                              textAlign:
                                  TextAlign.right, // Align input to the right
                              textDirection: TextDirection.rtl,
                              decoration: InputDecoration(
                                labelText: "رمز المدرسة",
                                border: const OutlineInputBorder(),
                                focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                      color: AppColors.sColor, width: 2.0),
                                ),
                                labelStyle: const TextStyle(fontSize: 18),
                                floatingLabelStyle:
                                    TextStyle(color: AppColors.sColor),
                              ),
                              keyboardType: TextInputType.number,
                              maxLength: 2, // Limit to 2 digits
                              inputFormatters: [
                                FilteringTextInputFormatter
                                    .digitsOnly, // Only allow numbers
                              ],
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'يجب إدخال رقمين بعد SH';
                                } else if (value.length != 2) {
                                  return 'يجب إدخال رقمين بعد SH';
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // First Name Field
                      TextFormField(
                        controller: firstNameController,
                        textAlign: TextAlign.right,
                        textDirection: TextDirection.rtl,
                        decoration: InputDecoration(
                          labelText: "اسم الطالب الأول",
                          border: const OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                            borderSide:
                                BorderSide(color: AppColors.sColor, width: 2.0),
                          ),
                          labelStyle: const TextStyle(fontSize: 18),
                          floatingLabelStyle:
                              TextStyle(color: AppColors.sColor),
                        ),
                        keyboardType: TextInputType.text,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يجب إدخال اسم الطالب الأول';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Last Name Field
                      TextFormField(
                        controller: lastNameController,
                        textAlign: TextAlign.right,
                        textDirection: TextDirection.rtl,
                        decoration: InputDecoration(
                          labelText: "اسم عائلة الطالب",
                          border: const OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                            borderSide:
                                BorderSide(color: AppColors.sColor, width: 2.0),
                          ),
                          labelStyle: const TextStyle(fontSize: 18),
                          floatingLabelStyle:
                              TextStyle(color: AppColors.sColor),
                        ),
                        keyboardType: TextInputType.text,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يجب إدخال اسم عائلة الطالب';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // National ID / Residence Permit Field
                      TextFormField(
                        controller: nationalIdController,
                        textAlign: TextAlign.right,
                        textDirection: TextDirection.rtl,
                        decoration: InputDecoration(
                          labelText: "الإقامة أو الهوية الوطنية",
                          border: const OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                            borderSide:
                                BorderSide(color: AppColors.sColor, width: 2.0),
                          ),
                          labelStyle: const TextStyle(fontSize: 18),
                          floatingLabelStyle:
                              TextStyle(color: AppColors.sColor),
                        ),
                        keyboardType: TextInputType.number,
                        maxLength: 10, // Limit to 10 digits for UID
                        inputFormatters: [
                          FilteringTextInputFormatter
                              .digitsOnly, // Only allow numbers
                        ],
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يجب إدخال الإقامة أو الهوية الوطنية';
                          } else if (value.length != 10) {
                            return 'يجب أن يكون الرقم 10 خانات';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Grade Dropdown Field
                      DropdownButtonFormField<String>(
                        value: selectedGrade,
                        decoration: InputDecoration(
                          labelText: "صف الطالب",
                          border: const OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                            borderSide:
                                BorderSide(color: AppColors.sColor, width: 2.0),
                          ),
                          labelStyle: const TextStyle(fontSize: 18),
                          floatingLabelStyle:
                              TextStyle(color: AppColors.sColor),
                        ),
                          dropdownColor: Color(0xFFE7F0EC), // Custom dropdown menu background color
                        items: <String>[
                          'الصف الأول',
                          'الصف الثاني',
                          'الصف الثالث',
                          'الصف الرابع',
                          'الصف الخامس',
                          'الصف السادس',
                          'الصف السابع',
                          'الصف الثامن',
                          'الصف التاسع',
                          'الصف العاشر',
                          'الصف الحادي عشر',
                          'الصف الثاني عشر',
                        ].map<DropdownMenuItem<String>>((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value, textAlign: TextAlign.right ,
                              style: TextStyle(
                                fontFamily: 'Zain', // Custom font family
                              ),),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {
                          setState(() {
                            selectedGrade = newValue;
                          });
                        },
                        validator: (value) {
                          if (value == null) {
                            return 'يجب اختيار صف الطالب';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Divider for Address
                      const Row(
                        children: [
                          Expanded(
                            child: Divider(
                              thickness: 1,
                              color: Colors.grey,
                              endIndent: 10,
                            ),
                          ),
                          Text(
                            "عنوان المنزل",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey,
                              fontFamily: 'Zain', 
                            ),
                          ),
                          Expanded(
                            child: Divider(
                              thickness: 1,
                              color: Colors.grey,
                              indent: 10,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // City Field
                      TextFormField(
                        controller: cityController,
                        textAlign: TextAlign.right,
                        textDirection: TextDirection.rtl,
                        decoration: InputDecoration(
                          labelText: "المدينة",
                          border: const OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                            borderSide:
                                BorderSide(color: AppColors.sColor, width: 2.0),
                          ),
                          labelStyle: const TextStyle(fontSize: 18),
                          floatingLabelStyle:
                              TextStyle(color: AppColors.sColor),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يجب إدخال المدينة';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // District Field
                      TextFormField(
                        controller: districtController,
                        textAlign: TextAlign.right,
                        textDirection: TextDirection.rtl,
                        decoration: InputDecoration(
                          labelText: "الحي",
                          border: const OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                            borderSide:
                                BorderSide(color: AppColors.sColor, width: 2.0),
                          ),
                          labelStyle: const TextStyle(fontSize: 18),
                          floatingLabelStyle:
                              TextStyle(color: AppColors.sColor),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يجب إدخال الحي';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Street Field
                      TextFormField(
                        controller: streetController,
                        textAlign: TextAlign.right,
                        textDirection: TextDirection.rtl,
                        decoration: InputDecoration(
                          labelText: "الشارع",
                          border: const OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                            borderSide:
                                BorderSide(color: AppColors.sColor, width: 2.0),
                          ),
                          labelStyle: const TextStyle(fontSize: 18),
                          floatingLabelStyle:
                              TextStyle(color: AppColors.sColor),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يجب إدخال الشارع';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Postal Code Field
                      TextFormField(
                        controller: postalCodeController,
                        textAlign: TextAlign.right, // Align input to the right
                        textDirection: TextDirection.rtl,
                        decoration: InputDecoration(
                          labelText: "الرمز البريدي",
                          border: const OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                            borderSide:
                                BorderSide(color: AppColors.sColor, width: 2.0),
                          ),
                          labelStyle: const TextStyle(fontSize: 18),
                          floatingLabelStyle:
                              TextStyle(color: AppColors.sColor),
                        ),
                        keyboardType: TextInputType.number,
                        maxLength: 5, // Limit to 5 digits for postal code
                        inputFormatters: [
                          FilteringTextInputFormatter
                              .digitsOnly, // Only allow numbers
                        ],
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يجب إدخال الرمز البريدي';
                          } else if (value.length != 5) {
                            return 'يجب أن يتكون الرمز البريدي من 5 أرقام';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      if (isSubmitting)
                        const CircularProgressIndicator()
                      else
                        Align(
                          alignment: Alignment.centerRight,
                          child: ElevatedButton(
                            onPressed: () async {
                              if (_formKey.currentState?.validate() ?? false) {
                                 // Fetch parent's national ID from Firestore
    String? parentNationalId = await getParentNationalId();

    if (parentNationalId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('فشل في استرجاع هوية الأب'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
                                // Create the newChild map with form data
                                final newChild = {
                                  'uid': nationalIdController.text,
                                  'school':
                                      "SH${schoolCodeController.text}", // Append "SH" to school code
                                  'studentFirstName': firstNameController.text,
                                  'studentFamilyName': lastNameController.text,
                                  'parentPhone': parentPhoneController.text,
                                  'parentUid': parentNationalId,
                                  'grade': selectedGrade,
                                  'address': {
                                    'city': cityController.text,
                                    'district': districtController.text,
                                    'street': streetController.text,
                                    'postalCode': postalCodeController.text,
                                  },
                                  'boradingStatus':
                                      boradingStatusController.text,
                                };
      print('finaaaaaaaaaly');
      print(parentNationalId);
      print(newChild);

                                // Set the state to show loading
                                setState(() {
                                  isSubmitting = true;
                                });

                                // Call the method to add the child with the new data
                                bool success = await addChild(newChild);

                                setState(() {
                                  isSubmitting = false;
                                });

                                // Handle the result from the server
                                if (success) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('تم إضافة الطالب بنجاح!'),
                                      backgroundColor: Color(0xFFE7F0EC),
                                    ),
                                  );

                                  // Clear form fields
                                  firstNameController.clear();
                                  lastNameController.clear();
                                  schoolCodeController.clear();
                                  cityController.clear();
                                  districtController.clear();
                                  streetController.clear();
                                  postalCodeController.clear();
                                  nationalIdController.clear();
                                  selectedGrade = null; // Reset the dropdown

                                  // Close the form and go back to the previous screen
                                  Navigator.pop(context,true);
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('حدث خطأ أثناء الإضافة.'),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                }
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF01391F),
                              foregroundColor: Colors.white,
                              textStyle: const TextStyle(fontSize: 18 , fontFamily: 'Zain', ),
                            ),
                            child: const Text("إضافة"),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
// Fetch parent's national ID from Firestore
Future<String?> getParentNationalId() async {
  try {
    String? uid = await storage.read(key: 'nationalID'); // This is the UID

      return uid; // This is the real national ID you want

  } catch (e) {
    print('Error fetching national ID from Firestore: $e');
    return null;
  }
}

  Future<bool> addChild(Map<String, dynamic> newChild) async {
    const url = 'http://10.0.2.2:5000/api/addchild';

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
          'Authorization': 'Bearer $idToken', // Attach the Firebase token
        },
        body: jsonEncode({'newChild': newChild}),
      );

      if (response.statusCode == 200) {
        print('Child added successfully!');
        return true; // Success
      } else {
        print('Failed to add child: ${response.body}');
        return false; // Failure
      }
    } catch (error) {
      print('Error adding child: $error');
      return false; // Failure due to an error
    }
  }
}
