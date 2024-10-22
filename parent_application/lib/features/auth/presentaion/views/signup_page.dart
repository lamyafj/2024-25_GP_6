import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'otp_screen.dart';
import 'package:parent_application/features/auth/presentaion/background_widget.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SignUpPage extends StatefulWidget {
  @override
  _SignUpPageState createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _idController =
      TextEditingController(); // National ID

  bool isLoading = false;
  bool isBackgroundLoaded = false;
  String? errorMessage;

  final storage = FlutterSecureStorage(); // Initialize the storage instance

  @override
  void initState() {
    super.initState();
    loadBackground();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _idController.dispose();
    super.dispose();
  }

  Future<void> loadBackground() async {
    await Future.delayed(Duration(seconds: 1)); // Simulate a loading time
    setState(() {
      isBackgroundLoaded = true;
    });
  }

  void startPhoneVerification(
      String phoneNumber, String nationalId, String name) async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    // Check if the national ID already exists as a UID
    final uidQuery = await FirebaseFirestore.instance
        .collection('Parent')
        .where('uid', isEqualTo: nationalId)
        .get();

    if (uidQuery.docs.isNotEmpty) {
      // National ID already exists as UID
      setState(() {
        isLoading = false;
        errorMessage = ' الهوية الوطنية مسجلة بالفعل. يرجى استخدام رقم آخر.';
      });
      return; // Exit the method to prevent further processing
    }

    // Check if the phone number already exists in the Firestore database
    final phoneNumberQuery = await FirebaseFirestore.instance
        .collection('Parent')
        .where('phoneNumber', isEqualTo: '+966$phoneNumber')
        .get();

    if (phoneNumberQuery.docs.isNotEmpty) {
      // Phone number already exists
      setState(() {
        isLoading = false;
        errorMessage = ' الرقم مسجل بالفعل. يرجى استخدام رقم آخر.';
      });
      return; // Exit the method to prevent further processing
    }

    await FirebaseAuth.instance.verifyPhoneNumber(
      phoneNumber: '+966$phoneNumber',
      verificationCompleted: (phoneAuthCredential) async {
        // Sign in the user
        await FirebaseAuth.instance.signInWithCredential(phoneAuthCredential);
        handleSignUpSuccess(
            nationalId, phoneNumber, name); // Call success on completion
      },
      verificationFailed: (FirebaseAuthException error) {
        print("Verification failed: ${error.message}");
        setState(() {
          isLoading = false;
          errorMessage = 'Verification failed: ${error.message}';
        });
      },
      codeSent: (verificationId, forceResendingToken) {
        setState(() {
          isLoading = false;
        });
        // Navigate to OTP screen
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => OTPScreen(
              verificationId: verificationId,
              onOtpVerified: () =>
                  handleSignUpSuccess(nationalId, phoneNumber, name),
            ),
          ),
        );
      },
      codeAutoRetrievalTimeout: (verificationId) {
        setState(() {
          isLoading = false;
        });
      },
    );
  }

  Future<void> saveUserData(
      String nationalId, String phoneNumber, String name) async {
    CollectionReference parents =
        FirebaseFirestore.instance.collection('Parent');

    // Save the national ID as the document ID
    await parents.doc(nationalId).set({
      'name': name,
      'phoneNumber': '+966$phoneNumber',
      'uid': nationalId, // Save National ID as UID
    }, SetOptions(merge: true)).catchError((error) {
      print("Failed to create user: $error");
    });

    await storage.write(
        key: 'nationalID', value: nationalId); // Store National ID securely
  }

  void handleSignUpSuccess(
      String nationalId, String phoneNumber, String name) async {
    await saveUserData(nationalId, phoneNumber, name);

    // Show success message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Center(
          child: Text(
            "تم التسجيل بنجاح، يمكنك تسجيل الدخول الآن.",
            style: TextStyle(
              fontFamily: 'Zain',
              color: Color.fromRGBO(1, 57, 31, 1.0),
            ),
          ),
        ),
        backgroundColor: const Color(0xFFE7F0EC),
      ),
    );

    // Redirect to login page
    GoRouter.of(context).go('/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Stack(
        children: [
          BackgroundWidget(),
          if (isBackgroundLoaded)
            Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 35.0, vertical: 60.0),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const SizedBox(height: 190),
                    const Text(
                      'تسجيل جديد',
                      style: TextStyle(fontSize: 28, fontFamily: 'Zain'),
                      textAlign: TextAlign.right,
                    ),
                    const SizedBox(height: 30),
                    Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          TextFormField(
                            controller: _nameController,
                            textAlign: TextAlign.right,
                            decoration: InputDecoration(
                              border: const OutlineInputBorder(),
                              label: Align(
                                alignment: Alignment.centerRight,
                                child: Text('الاسم',
                                    style: TextStyle(fontFamily: 'Zain')),
                              ),
                              hintText: 'الاسم',
                              hintStyle: const TextStyle(
                                  fontSize: 14, fontFamily: 'Zain'),
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
                          TextFormField(
                            controller: _idController,
                            textAlign: TextAlign.right,
                            keyboardType: TextInputType.number,
                            inputFormatters: [
                              FilteringTextInputFormatter.digitsOnly,
                              LengthLimitingTextInputFormatter(10),
                            ],
                            decoration: InputDecoration(
                              border: const OutlineInputBorder(),
                              label: Align(
                                alignment: Alignment.centerRight,
                                child: Text('الهوية الوطنية أو الإقامة',
                                    style: TextStyle(fontFamily: 'Zain')),
                              ),
                              hintText: 'الهوية الوطنية أو الإقامة',
                              hintStyle: TextStyle(fontFamily: 'Zain'),
                            ),
                            maxLength: 10,
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'يرجى إدخال الهوية الوطنية أو الإقامة';
                              } else if (value.length != 10) {
                                return 'يرجى إدخال رقم صالح مكون من 10 أرقام';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 20),
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
                                child: Text('رقم الجوال',
                                    style: TextStyle(fontFamily: 'Zain')),
                              ),
                              hintText: 'رقم الجوال',
                              hintStyle: const TextStyle(
                                  fontSize: 14, fontFamily: 'Zain'),
                              prefixText: '+966 ',
                            ),
                            maxLength: 9,
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
                          const SizedBox(height: 10),
                          if (errorMessage != null)
                            Text(
                              errorMessage!,
                              style: TextStyle(
                                  color: Colors.red, fontFamily: 'Zain'),
                            ),
                          const SizedBox(height: 10),
                          SizedBox(
                            width: double.infinity,
                            height: 50,
                            child: ElevatedButton(
                              onPressed: isLoading
                                  ? null
                                  : () {
                                      if (_formKey.currentState!.validate()) {
                                        String phoneNumber =
                                            _phoneController.text;
                                        String name = _nameController.text;
                                        String nationalId = _idController
                                            .text; // Use this as National ID
                                        startPhoneVerification(
                                            phoneNumber, nationalId, name);
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
                                  ? const CircularProgressIndicator(
                                      color: Colors.white)
                                  : const Text(
                                      'تسجيل',
                                      style: TextStyle(
                                          fontSize: 18,
                                          color: Colors.white,
                                          fontFamily: 'Zain'),
                                    ),
                            ),
                          ),
                          const SizedBox(height: 20),
                          Center(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                GestureDetector(
                                  onTap: () =>
                                      GoRouter.of(context).go('/login'),
                                  child: const Text(
                                    'تسجيل الدخول ',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontFamily: 'Zain',
                                      color: Color.fromRGBO(196, 174, 87, 1.0),
                                      decoration: TextDecoration.underline,
                                    ),
                                  ),
                                ),
                                const Text(
                                  'لديك حساب؟ ',
                                  style: TextStyle(
                                      fontSize: 18, fontFamily: 'Zain'),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          if (!isBackgroundLoaded)
            const Center(
              child: CircularProgressIndicator(
                  color: Color.fromRGBO(196, 174, 87, 1.0)),
            ),
        ],
      ),
    );
  }
}
