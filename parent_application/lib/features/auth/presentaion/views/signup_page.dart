/*import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class SignUpPage extends StatefulWidget {
  final VoidCallback onSignUpSuccess;

  SignUpPage({super.key, required this.onSignUpSuccess});

  @override
  _SignUpPageState createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  bool _passwordVisible = false;
  bool _confirmPasswordVisible = false;

  @override
  void initState() {
    super.initState();
    _passwordVisible = false;
    _confirmPasswordVisible = false;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: false,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 35.0, vertical: 60.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                const SizedBox(height: 60),
                const Text(
                  'تسجيل جديد',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 40),
                TextFormField(
                  controller: _nameController,
                  textAlign: TextAlign.right,
                  decoration: InputDecoration(
                    border: const OutlineInputBorder(),
                    label: Align(
                      alignment: Alignment.centerRight,
                      child: Text('الاسم'),
                    ),
                    hintText: 'الاسم',
                    hintStyle: const TextStyle(fontSize: 14),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'يرجى إدخال الاسم';
                    } else if (!RegExp(r'^[\u0621-\u064A\s]+$')
                        .hasMatch(value)) {
                      return 'يرجى إدخال اسم صالح باللغة العربية';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                // Phone TextFormField
                TextFormField(
                  controller: _phoneController,
                  textAlign: TextAlign.right,
                  keyboardType: TextInputType.phone,
                  inputFormatters: [
                    FilteringTextInputFormatter
                        .digitsOnly, // Only numbers allowed
                    LengthLimitingTextInputFormatter(9), // Limit to 9 digits
                  ],
                  decoration: InputDecoration(
                    border: const OutlineInputBorder(),
                    label: Align(
                      alignment: Alignment.centerRight,
                      child: Text('رقم الجوال'),
                    ),
                    hintText: 'رقم الجوال',
                    hintStyle: const TextStyle(fontSize: 14),
                    prefixText: '+966 ',
                    counterText: '', // Hide the counter
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'يرجى إدخال رقم الجوال';
                    } else if (value.length != 9 ||
                        !RegExp(r'^[5][0-9]{8}$').hasMatch(value)) {
                      return 'يرجى إدخال رقم جوال صالح مكون من 9 أرقام يبدأ بـ 5';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                TextFormField(
                  controller: _passwordController,
                  textAlign: TextAlign.right,
                  obscureText: !_passwordVisible,
                  decoration: InputDecoration(
                    border: const OutlineInputBorder(),
                    label: Align(
                      alignment: Alignment.centerRight,
                      child: Text('كلمة المرور'),
                    ),
                    hintText: 'كلمة المرور',
                    hintStyle: const TextStyle(fontSize: 14),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _passwordVisible
                            ? Icons.visibility
                            : Icons.visibility_off,
                      ),
                      onPressed: () {
                        setState(() {
                          _passwordVisible = !_passwordVisible;
                        });
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'يرجى إدخال كلمة المرور';
                    } else if (value.length < 6) {
                      return 'يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                TextFormField(
                  controller: _confirmPasswordController,
                  textAlign: TextAlign.right,
                  obscureText: !_confirmPasswordVisible,
                  decoration: InputDecoration(
                    border: const OutlineInputBorder(),
                    label: Align(
                      alignment: Alignment.centerRight,
                      child: Text('تأكيد كلمة المرور'),
                    ),
                    hintText: 'تأكيد كلمة المرور',
                    hintStyle: const TextStyle(fontSize: 14),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _confirmPasswordVisible
                            ? Icons.visibility
                            : Icons.visibility_off,
                      ),
                      onPressed: () {
                        setState(() {
                          _confirmPasswordVisible = !_confirmPasswordVisible;
                        });
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'يرجى تأكيد كلمة المرور';
                    } else if (value != _passwordController.text) {
                      return 'كلمتا المرور غير متطابقتين';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                // Sign Up Button
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        // Delay the navigation to the home page by 2 seconds
                        Future.delayed(const Duration(seconds: 2), () {
                          // Call the onSignUpSuccess callback to navigate to the home page
                          widget.onSignUpSuccess();
                        });
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          const Color.fromRGBO(1, 57, 31, 1.0), // Button color
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                    ),
                    child: const Text(
                      'تسجيل',
                      style: TextStyle(fontSize: 18, color: Colors.white),
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
}
*/

import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'otp_screen.dart';

class SignUpPage extends StatefulWidget {
  @override
  _SignUpPageState createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  bool isLoading = false;
  String? errorMessage;

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> saveUserData(String phoneNumber, String name) async {
    CollectionReference parents =
        FirebaseFirestore.instance.collection('Parent');

    // Check if the phone number already contains +966 to avoid duplication
    String formattedPhoneNumber =
        phoneNumber.startsWith('+966') ? phoneNumber : '+966' + phoneNumber;

    // Add a new parent document with an empty children array
    return parents.doc(formattedPhoneNumber).set({
      'name': name,
      'phoneNumber': formattedPhoneNumber,
      'children': [] // Empty array for children
    }, SetOptions(merge: false)) // Do not merge data if it exists
        .catchError((error) {
      print("Failed to create user: $error");
    });
  }

  void handleSignUpSuccess(String phoneNumber, String name) async {
    await saveUserData(phoneNumber, name);

    // Show success message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("تم التسجيل بنجاح"),
        backgroundColor: const Color(0xFFE7F0EC),
      ),
    );

    // Redirect to login page
    GoRouter.of(context).go('/login');
  }

  Future<bool> isUserRegistered(String phoneNumber) async {
    DocumentSnapshot document = await FirebaseFirestore.instance
        .collection('Parent')
        .doc(phoneNumber)
        .get();

    return document.exists;
  }

  void startPhoneVerification(String phoneNumber, String name) async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    bool alreadyRegistered = await isUserRegistered(phoneNumber);
    if (alreadyRegistered) {
      setState(() {
        isLoading = false;
        errorMessage = 'رقم الجوال مسجل بالفعل. يرجى تسجيل الدخول.';
      });
      return; // Exit the function without updating or creating the user
    }

    await FirebaseAuth.instance.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      verificationCompleted: (phoneAuthCredential) {
        // Auto verification (not commonly used with OTP)
      },
      verificationFailed: (FirebaseAuthException error) {
        print("Verification failed: ${error.message}");
        setState(() {
          isLoading = false;
          errorMessage = 'فشل التحقق. يرجى المحاولة مرة أخرى.';
        });
      },
      codeSent: (verificationId, forceResendingToken) {
        setState(() {
          isLoading = false;
        });
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => OTPScreen(
              verificationId: verificationId,
              onOtpVerified: () => handleSignUpSuccess(phoneNumber, name),
            ),
          ),
        );
      },
      codeAutoRetrievalTimeout: (verificationId) {
        // Handle auto-retrieval timeout if necessary
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: false,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 35.0, vertical: 60.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Form(
              key: _formKey,
              child: Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      const SizedBox(height: 60),
                      const Text(
                        'تسجيل جديد',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 40),
                      // Name TextFormField
                      TextFormField(
                        controller: _nameController,
                        textAlign: TextAlign.right,
                        decoration: InputDecoration(
                          border: const OutlineInputBorder(),
                          label: Align(
                            alignment: Alignment.centerRight,
                            child: Text('الاسم'),
                          ),
                          hintText: 'الاسم',
                          hintStyle: const TextStyle(fontSize: 14),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يرجى إدخال الاسم';
                          } else if (!RegExp(r'^[\u0621-\u064A\s]+$')
                              .hasMatch(value)) {
                            return 'يرجى إدخال اسم صالح باللغة العربية';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),
                      // Phone TextFormField
                      TextFormField(
                        controller: _phoneController,
                        textAlign: TextAlign.right,
                        keyboardType: TextInputType.phone,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          LengthLimitingTextInputFormatter(9),
                        ],
                        decoration: InputDecoration(
                          border: const OutlineInputBorder(),
                          label: Align(
                            alignment: Alignment.centerRight,
                            child: Text('رقم الجوال'),
                          ),
                          hintText: 'رقم الجوال',
                          hintStyle: const TextStyle(fontSize: 14),
                          prefixText: '+966 ',
                          counterText: '',
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يرجى إدخال رقم الجوال';
                          } else if (value.length != 9 ||
                              !RegExp(r'^[5][0-9]{8}$').hasMatch(value)) {
                            return 'يرجى إدخال رقم جوال صالح مكون من 9 أرقام يبدأ بـ 5';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),
                      if (errorMessage != null)
                        Text(
                          errorMessage!,
                          style: TextStyle(color: Colors.red),
                        ),
                      const SizedBox(height: 20),
                      // Sign Up Button
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: isLoading
                              ? null
                              : () {
                                  if (_formKey.currentState!.validate()) {
                                    String phoneNumber =
                                        '+966${_phoneController.text}';
                                    String name = _nameController.text;
                                    startPhoneVerification(phoneNumber, name);
                                  }
                                },
                          style: ElevatedButton.styleFrom(
                            backgroundColor:
                                const Color.fromRGBO(1, 57, 31, 1.0),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                          ),
                          child: isLoading
                              ? CircularProgressIndicator(
                                  color: Colors.white,
                                )
                              : const Text(
                                  'تسجيل',
                                  style: TextStyle(
                                      fontSize: 18, color: Colors.white),
                                ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          MouseRegion(
                            cursor: SystemMouseCursors.click,
                            child: GestureDetector(
                              onTap: () {
                                GoRouter.of(context).go('/login');
                              },
                              child: const Text(
                                'تسجيل الدخول',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Color.fromRGBO(196, 174, 87, 1.0),
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                            ),
                          ),
                          const Text(
                            'لديك حساب بالفعل؟ ',
                            style: TextStyle(fontSize: 18),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
