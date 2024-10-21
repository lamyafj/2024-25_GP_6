import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'otp_screen.dart';
import 'package:parent_application/features/auth/presentaion/background_widget.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final FlutterSecureStorage storage = FlutterSecureStorage();
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _phoneController = TextEditingController();
  bool isLoading = false;
  bool isBackgroundLoaded = false; // Flag to check if background is loaded
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    loadBackground();
  }

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> loadBackground() async {
    await Future.delayed(Duration(seconds: 1)); // Simulate a loading time
    setState(() {
      isBackgroundLoaded = true; // Set background loaded to true
    });
  }

  Future<void> checkPhoneNumber(String phoneNumber) async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    CollectionReference parents =
        FirebaseFirestore.instance.collection('Parent');

    try {
      // Query the collection for the specific phone number
      QuerySnapshot querySnapshot = await parents
          .where('phoneNumber', isEqualTo: '+966$phoneNumber')
          .get();

      if (querySnapshot.docs.isNotEmpty) {
        // Phone number exists, proceed with verification
        String nationalId =
            querySnapshot.docs.first.id; // Get the document ID (National ID)
        startPhoneVerification(phoneNumber, nationalId);
      } else {
        setState(() {
          errorMessage = 'رقم الجوال غير مسجل'; // "Phone number not registered"
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage =
            'حدث خطأ أثناء الاتصال بقاعدة البيانات'; // "An error occurred while connecting to the database"
        isLoading = false;
      });
      print("Error checking phone number: $e");
    }
  }

  void startPhoneVerification(String phoneNumber, String nationalId) async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    await FirebaseAuth.instance.verifyPhoneNumber(
      phoneNumber: '+966$phoneNumber',
      verificationCompleted: (phoneAuthCredential) async {
        await FirebaseAuth.instance.signInWithCredential(phoneAuthCredential);
        _handleLoginAfterVerification(nationalId); // Use National ID here
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
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => OTPScreen(
              verificationId: verificationId,
              onOtpVerified: () {
                _handleLoginAfterVerification(
                    nationalId); // Use National ID here
              },
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

  void _handleLoginAfterVerification(String nationalId) async {
    // Retrieve the token
    String? token = await FirebaseAuth.instance.currentUser?.getIdToken();

    // Check if the token is valid before storing
    if (token != null) {
      await storage.write(key: 'firebaseToken', value: token); // Save token
      await storage.write(
          key: 'nationalID', value: nationalId); // Save National ID
      print("Stored National ID: $nationalId"); // Log stored National ID
      GoRouter.of(context).go('/home');
    } else {
      setState(() {
        errorMessage = 'Failed to retrieve token. Please try again.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      body: Stack(
        children: [
          BackgroundWidget(), // Background Widget
          if (isBackgroundLoaded) // Show content only after background is loaded
            Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                    horizontal: 35.0, vertical: 150.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const SizedBox(height: 100),
                      const Text(
                        '!أهلاً بك',
                        style: TextStyle(fontSize: 24, fontFamily: 'Zain'),
                        textAlign: TextAlign.right,
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        'تسجيل الدخول',
                        style: TextStyle(fontSize: 28, fontFamily: 'Zain'),
                        textAlign: TextAlign.right,
                      ),
                      const SizedBox(height: 30),
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
                          hintStyle:
                              const TextStyle(fontSize: 14, fontFamily: 'Zain'),
                          prefixText: '+966 ',
                          prefixStyle: TextStyle(fontFamily: 'Zain'),
                          counterText: '${_phoneController.text.length}/9',
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
                        onChanged: (value) {
                          setState(() {
                            errorMessage = null; // Clear error message
                          });
                        },
                      ),
                      const SizedBox(height: 20),
                      if (errorMessage != null)
                        Text(errorMessage!,
                            style: TextStyle(color: Colors.red)),
                      const SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: isLoading
                              ? null
                              : () {
                                  if (_formKey.currentState!.validate()) {
                                    String phoneNumber = _phoneController.text;
                                    checkPhoneNumber(phoneNumber);
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
                              ? CircularProgressIndicator(color: Colors.white)
                              : const Text(
                                  'تسجيل الدخول',
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
                            MouseRegion(
                              child: GestureDetector(
                                onTap: () =>
                                    GoRouter.of(context).go('/sign_up'),
                                child: const Text(
                                  'للتسجيل ',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontFamily: 'Zain',
                                    color: Color.fromRGBO(196, 174, 87, 1.0),
                                    decoration: TextDecoration.underline,
                                    decorationColor:
                                        Color.fromRGBO(196, 174, 87, 1.0),
                                  ),
                                ),
                              ),
                            ),
                            const Text(
                              'ليس لديك حساب؟ ',
                              style:
                                  TextStyle(fontSize: 18, fontFamily: 'Zain'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          if (!isBackgroundLoaded) // Show loading indicator while background loads
            Center(
              child: CircularProgressIndicator(
                color: Color.fromRGBO(196, 174, 87, 1.0), // Loading color
              ),
            ),
        ],
      ),
    );
  }
}
