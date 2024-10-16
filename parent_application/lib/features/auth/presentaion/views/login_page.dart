// // import 'package:flutter/material.dart';
// // import 'package:flutter/services.dart';
// // import 'package:go_router/go_router.dart';

// // class LoginPage extends StatefulWidget {
// //   LoginPage({super.key});

// //   @override
// //   _LoginPageState createState() => _LoginPageState();
// // }

// // class _LoginPageState extends State<LoginPage> {
// //   final _formKey = GlobalKey<FormState>();
// //   final TextEditingController _phoneController = TextEditingController();
// //   final TextEditingController _passwordController = TextEditingController();
// //   bool _passwordVisible = false;

// //   @override
// //   void initState() {
// //     super.initState();
// //     _passwordVisible = false;
// //   }

// //   @override
// //   void dispose() {
// //     _phoneController.dispose();
// //     _passwordController.dispose();
// //     super.dispose();
// //   }

// //   @override
// //   Widget build(BuildContext context) {
// //     return Scaffold(
// //       backgroundColor: Colors.white,
// //       resizeToAvoidBottomInset: false,
// //       body: Column(
// //         children: [
// //           Expanded(
// //             child: SingleChildScrollView(
// //               padding:
// //                   const EdgeInsets.symmetric(horizontal: 35.0, vertical: 60.0),
// //               child: Form(
// //                 key: _formKey,
// //                 child: Column(
// //                   mainAxisAlignment: MainAxisAlignment.start,
// //                   children: [
// //                     const SizedBox(height: 60),
// //                     const Text(
// //                       '!أهلاً بك',
// //                       style: TextStyle(
// //                         fontSize: 24,
// //                         fontWeight: FontWeight.bold,
// //                       ),
// //                     ),
// //                     const SizedBox(height: 10),
// //                     const Text(
// //                       'تسجيل الدخول',
// //                       style: TextStyle(
// //                         fontSize: 28,
// //                         fontWeight: FontWeight.bold,
// //                       ),
// //                     ),
// //                     const SizedBox(height: 40),
// //                     // Phone TextFormField
// //                     TextFormField(
// //                       controller: _phoneController,
// //                       textAlign: TextAlign.right,
// //                       keyboardType: TextInputType.phone,
// //                       inputFormatters: [
// //                         FilteringTextInputFormatter
// //                             .digitsOnly, // Allows only numbers
// //                         LengthLimitingTextInputFormatter(
// //                             9), // Limit to 9 digits
// //                       ],
// //                       decoration: InputDecoration(
// //                         border: const OutlineInputBorder(),
// //                         label: Align(
// //                           alignment: Alignment.centerRight,
// //                           child: Text('رقم الجوال'),
// //                         ),
// //                         hintText: 'رقم الجوال',
// //                         hintStyle: const TextStyle(fontSize: 14),
// //                         prefixText: '+966 ',
// //                         counterText:
// //                             '', // Hides the default counter for the max length
// //                       ),
// //                       maxLength: 9, // Restricts to 9 digits
// //                       validator: (value) {
// //                         if (value == null || value.isEmpty) {
// //                           return 'يرجى إدخال رقم الجوال';
// //                         } else if (value.length != 9 ||
// //                             !RegExp(r'^[5][0-9]{8}$').hasMatch(value)) {
// //                           return 'يرجى إدخال رقم جوال صالح مكون من 9 أرقام يبدأ بـ 5';
// //                         }
// //                         return null;
// //                       },
// //                     ),

// //                     const SizedBox(height: 20),
// //                     // Password TextFormField
// //                     // TextFormField(
// //                     //   controller: _passwordController,
// //                     //   textAlign: TextAlign.right,
// //                     //   obscureText: !_passwordVisible,
// //                     //   decoration: InputDecoration(
// //                     //     border: const OutlineInputBorder(),
// //                     //     label: Align(
// //                     //       alignment: Alignment.centerRight,
// //                     //       child: Text('كلمة المرور'),
// //                     //     ),
// //                     //     hintText: 'كلمة المرور',
// //                     //     hintStyle: const TextStyle(fontSize: 14),
// //                     //     suffixIcon: IconButton(
// //                     //       icon: Icon(
// //                     //         _passwordVisible
// //                     //             ? Icons.visibility
// //                     //             : Icons.visibility_off,
// //                     //       ),
// //                     //       onPressed: () {
// //                     //         setState(() {
// //                     //           _passwordVisible = !_passwordVisible;
// //                     //         });
// //                     //       },
// //                     //     ),
// //                     //   ),
// //                     //   validator: (value) {
// //                     //     if (value == null || value.isEmpty) {
// //                     //       return 'يرجى إدخال كلمة المرور';
// //                     //     } else if (value.length < 6) {
// //                     //       return 'يجب أن تكون كلمة المرور مكونة من 6 أحرف على الأقل';
// //                     //     }
// //                     //     return null;
// //                     //   },
// //                     // ),
// //                     const SizedBox(height: 20),
// //                     SizedBox(
// //                       width: double.infinity,
// //                       height: 50,
// //                       child: ElevatedButton(
// //                         onPressed: () {
// //                           if (_formKey.currentState!.validate()) {
// //                             context.go("/home");
// //                           }
// //                         },
// //                         style: ElevatedButton.styleFrom(
// //                           backgroundColor: const Color.fromRGBO(1, 57, 31, 1.0),
// //                           shape: RoundedRectangleBorder(
// //                             borderRadius: BorderRadius.circular(12.0),
// //                           ),
// //                         ),
// //                         child: const Text(
// //                           'تسجيل الدخول',
// //                           style: TextStyle(fontSize: 18, color: Colors.white),
// //                         ),
// //                       ),
// //                     ),
// //                     const SizedBox(height: 20),
// //                     Row(
// //                       mainAxisAlignment: MainAxisAlignment.center,
// //                       children: [
// //                         MouseRegion(
// //                           cursor:
// //                               SystemMouseCursors.click, // Add pointer cursor
// //                           child: GestureDetector(
// //                             onTap: () {
// //                               context.go("/sign_up");
// //                             },
// //                             child: const Text(
// //                               'للتسجيل',
// //                               style: TextStyle(
// //                                 fontSize: 18,
// //                                 color: Color.fromRGBO(196, 174, 87, 1.0),
// //                                 decoration: TextDecoration.underline,
// //                               ),
// //                             ),
// //                           ),
// //                         ),
// //                         const Text(
// //                           'مستخدم جديد؟ ',
// //                           style: TextStyle(fontSize: 18),
// //                         ),
// //                       ],
// //                     ),
// //                     const SizedBox(height: 20),
// //                   ],
// //                 ),
// //               ),
// //             ),
// //           ),
// //           Image.asset(
// //             'assets/images/Saudi.PNG',
// //             width: MediaQuery.of(context).size.width,
// //             height: 80,
// //             fit: BoxFit.cover,
// //           ),
// //         ],
// //       ),
// //     );
// //   }
// // }

// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'package:firebase_auth/firebase_auth.dart'; // Ensure you import Firebase Auth
// import 'package:go_router/go_router.dart';
// import 'dart:developer'; // For logging

// import 'otp_screen.dart'; // Ensure OTP Screen is imported

// class LoginPage extends StatefulWidget {
//   LoginPage({super.key});

//   @override
//   _LoginPageState createState() => _LoginPageState();
// }

// class _LoginPageState extends State<LoginPage> {
//   final _formKey = GlobalKey<FormState>();
//   final TextEditingController _phoneController = TextEditingController();
//   final TextEditingController _passwordController = TextEditingController();
  
//   bool _passwordVisible = false;
//   bool isLoading = false; // Define the isLoading variable

//   @override
//   void initState() {
//     super.initState();
//     _passwordVisible = false;
//   }

//   @override
//   void dispose() {
//     _phoneController.dispose();
//     _passwordController.dispose();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.white,
//       resizeToAvoidBottomInset: false,
//       body: Column(
//         children: [
//           Expanded(
//             child: SingleChildScrollView(
//               padding:
//                   const EdgeInsets.symmetric(horizontal: 35.0, vertical: 60.0),
//               child: Form(
//                 key: _formKey,
//                 child: Column(
//                   mainAxisAlignment: MainAxisAlignment.start,
//                   children: [
//                     const SizedBox(height: 60),
//                     const Text(
//                       '!أهلاً بك',
//                       style: TextStyle(
//                         fontSize: 24,
//                         fontWeight: FontWeight.bold,
//                       ),
//                     ),
//                     const SizedBox(height: 10),
//                     const Text(
//                       'تسجيل الدخول',
//                       style: TextStyle(
//                         fontSize: 28,
//                         fontWeight: FontWeight.bold,
//                       ),
//                     ),
//                     const SizedBox(height: 40),
//                     // Phone TextFormField
//                     TextFormField(
//                       controller: _phoneController,
//                       textAlign: TextAlign.right,
//                       keyboardType: TextInputType.phone,
//                       inputFormatters: [
//                         FilteringTextInputFormatter.digitsOnly, // Allows only numbers
//                         LengthLimitingTextInputFormatter(9), // Limit to 9 digits
//                       ],
//                       decoration: InputDecoration(
//                         border: const OutlineInputBorder(),
//                         label: Align(
//                           alignment: Alignment.centerRight,
//                           child: Text('رقم الجوال'),
//                         ),
//                         hintText: 'رقم الجوال',
//                         hintStyle: const TextStyle(fontSize: 14),
//                         prefixText: '+966 ',
//                         counterText: '', // Hides the default counter for the max length
//                       ),
//                       maxLength: 9, // Restricts to 9 digits
//                       validator: (value) {
//                         if (value == null || value.isEmpty) {
//                           return 'يرجى إدخال رقم الجوال';
//                         } else if (value.length != 9 ||
//                             !RegExp(r'^[5][0-9]{8}$').hasMatch(value)) {
//                           return 'يرجى إدخال رقم جوال صالح مكون من 9 أرقام يبدأ بـ 5';
//                         }
//                         return null;
//                       },
//                     ),
//                     const SizedBox(height: 20),

//                     const SizedBox(height: 20),
//                     SizedBox(
//                       width: double.infinity,
//                       height: 50,
//                       child: isLoading
//                           ? const CircularProgressIndicator() // Show loader if isLoading is true
//                           : ElevatedButton(
//                               onPressed: () async {
//                                 if (_formKey.currentState!.validate()) {
//                                   setState(() {
//                                     isLoading = true; // Set loading to true
//                                   });

//                                   // Start Firebase phone number verification
//                                   await FirebaseAuth.instance.verifyPhoneNumber(
//                                     phoneNumber: '+966${_phoneController.text}',
//                                     verificationCompleted: (phoneAuthCredential) {},
//                                     verificationFailed: (error) {
//                                       log(error.toString());
//                                       setState(() {
//                                         isLoading = false; // Set loading to false on failure
//                                       });
//                                     },
//                                     codeSent: (verificationId, forceResendingToken) {
//                                       setState(() {
//                                         isLoading = false; // Stop loading when code is sent
//                                       });
//                                       Navigator.push(
//                                         context,
//                                         MaterialPageRoute(
//                                           builder: (context) => OTPScreen(
//                                             verificationId: verificationId,
//                                           ),
//                                         ),
//                                       );
//                                     },
//                                     codeAutoRetrievalTimeout: (verificationId) {
//                                       log("Auto Retrieval timeout");
//                                     },
//                                   );
//                                 }
//                               },
//                               style: ElevatedButton.styleFrom(
//                                 backgroundColor: const Color.fromRGBO(1, 57, 31, 1.0),
//                                 shape: RoundedRectangleBorder(
//                                   borderRadius: BorderRadius.circular(12.0),
//                                 ),
//                               ),
//                               child: const Text(
//                                 'تسجيل الدخول',
//                                 style: TextStyle(fontSize: 18, color: Colors.white),
//                               ),
//                             ),
//                     ),
//                     const SizedBox(height: 20),
//                     Row(
//                       mainAxisAlignment: MainAxisAlignment.center,
//                       children: [
//                         MouseRegion(
//                           cursor: SystemMouseCursors.click, // Add pointer cursor
//                           child: GestureDetector(
//                             onTap: () {
//                               context.go("/sign_up");
//                             },
//                             child: const Text(
//                               'للتسجيل',
//                               style: TextStyle(
//                                 fontSize: 18,
//                                 color: Color.fromRGBO(196, 174, 87, 1.0),
//                                 decoration: TextDecoration.underline,
//                               ),
//                             ),
//                           ),
//                         ),
//                         const Text(
//                           'مستخدم جديد؟ ',
//                           style: TextStyle(fontSize: 18),
//                         ),
//                       ],
//                     ),
//                     const SizedBox(height: 20),
//                   ],
//                 ),
//               ),
//             ),
//           ),
//           Image.asset(
//             'assets/images/Saudi.PNG',
//             width: MediaQuery.of(context).size.width,
//             height: 80,
//             fit: BoxFit.cover,
//           ),
//         ],
//       ),
//     );
//   }
// }
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:go_router/go_router.dart';
import 'dart:developer'; // For logging
import 'otp_screen.dart';

class LoginPage extends StatefulWidget {
  LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _phoneController = TextEditingController();

  bool isLoading = false;
  String? errorMessage; // Variable to store and display error messages

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: false,
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 35.0, vertical: 60.0),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    const SizedBox(height: 60),
                    const Text(
                      '!أهلاً بك',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'تسجيل الدخول',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 40),
                    // Phone TextFormField
                    TextFormField(
                      controller: _phoneController,
                      textAlign: TextAlign.right,
                      keyboardType: TextInputType.phone,
                      inputFormatters: [
                        FilteringTextInputFormatter.digitsOnly, // Allows only numbers
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
                        counterText: '', // Hides the default counter for the max length
                      ),
                      maxLength: 9, // Restricts to 9 digits
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
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: isLoading
                          ? const CircularProgressIndicator() // Show loader if isLoading is true
                          : ElevatedButton(
                              onPressed: () async {
                                if (_formKey.currentState!.validate()) {
                                  setState(() {
                                    isLoading = true;
                                    errorMessage = null; // Reset error message
                                  });

                                  // Start Firebase phone number verification
                                  await FirebaseAuth.instance.verifyPhoneNumber(
                                    phoneNumber: '+966${_phoneController.text}',
                                    verificationCompleted: (phoneAuthCredential) {
                                      log("Verification completed automatically");
                                      setState(() {
                                        isLoading = false; // Stop loading
                                      });
                                    },
                                    verificationFailed: (FirebaseAuthException error) {
                                      log("Verification failed: ${error.message}");
                                      setState(() {
                                        isLoading = false; // Stop loading on failure
                                        errorMessage = "Verification failed: ${error.message}";
                                      });
                                    },
                                    codeSent: (verificationId, forceResendingToken) {
                                      log("Code sent: $verificationId");
                                      setState(() {
                                        isLoading = false; // Stop loading when code is sent
                                      });
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => OTPScreen(
                                            verificationId: verificationId,
                                          ),
                                        ),
                                      );
                                    },
                                    codeAutoRetrievalTimeout: (verificationId) {
                                      log("Auto Retrieval timeout: $verificationId");
                                    },
                                  );
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color.fromRGBO(1, 57, 31, 1.0),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12.0),
                                ),
                              ),
                              child: const Text(
                                'تسجيل الدخول',
                                style: TextStyle(fontSize: 18, color: Colors.white),
                              ),
                            ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        MouseRegion(
                          cursor: SystemMouseCursors.click, // Add pointer cursor
                          child: GestureDetector(
                            onTap: () {
                              context.go("/sign_up");
                            },
                            child: const Text(
                              'للتسجيل',
                              style: TextStyle(
                                fontSize: 18,
                                color: Color.fromRGBO(196, 174, 87, 1.0),
                                decoration: TextDecoration.underline,
                              ),
                            ),
                          ),
                        ),
                        const Text(
                          'مستخدم جديد؟ ',
                          style: TextStyle(fontSize: 18),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
          Image.asset(
            'assets/images/Saudi.PNG',
            width: MediaQuery.of(context).size.width,
            height: 80,
            fit: BoxFit.cover,
          ),
        ],
      ),
    );
  }
}
