import 'dart:developer';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class OTPScreen extends StatefulWidget {
  final String verificationId;
  final VoidCallback onOtpVerified;

  const OTPScreen({
    Key? key,
    required this.verificationId,
    required this.onOtpVerified,
  }) : super(key: key);

  @override
  State<OTPScreen> createState() => _OTPScreenState();
}

class _OTPScreenState extends State<OTPScreen> {
  final TextEditingController c1 = TextEditingController();
  final TextEditingController c2 = TextEditingController();
  final TextEditingController c3 = TextEditingController();
  final TextEditingController c4 = TextEditingController();
  final TextEditingController c5 = TextEditingController();
  final TextEditingController c6 = TextEditingController();

  bool isLoading = false; // Loading state for verification process
  bool correct = true; // Flag for indicating if the OTP is correct

  final storage = const FlutterSecureStorage();

  @override
  void dispose() {
    // Dispose controllers to free up resources
    c1.dispose();
    c2.dispose();
    c3.dispose();
    c4.dispose();
    c5.dispose();
    c6.dispose();
    super.dispose();
  }

  Future<void> verifyOtp() async {
    setState(() {
      isLoading = true;
      correct = true; // Reset correctness flag
    });

    try {
      // Combine OTP input from all text fields
      String smsCode =
          c1.text + c2.text + c3.text + c4.text + c5.text + c6.text;

      // Create credential using verification ID and entered SMS code
      final cred = PhoneAuthProvider.credential(
        verificationId: widget.verificationId,
        smsCode: smsCode,
      );

      // Sign in the user using the credential
      UserCredential userCredential =
          await FirebaseAuth.instance.signInWithCredential(cred);

      // Retrieve the ID token from the authenticated user
      String? token = await userCredential.user?.getIdToken();

      // Store the token securely
      if (token != null) {
        await storage.write(key: 'auth_token', value: token);
        print('Token stored securely: $token');
      }

      // OTP is correct, call onOtpVerified
      widget.onOtpVerified();
    } catch (e) {
      log(e.toString());
      setState(() {
        correct = false; // Set flag to false if OTP is incorrect
      });
    } finally {
      // Ensure loading state is reset after the operation
      setState(() {
        isLoading = false;
      });
    }
  }

  // Method to retrieve the stored token securely
  Future<String?> getToken() async {
    String? token = await storage.read(key: 'auth_token');
    return token;
  }

  // Method to clear the token securely (on logout or any other scenario)
  Future<void> clearToken() async {
    await storage.delete(key: 'auth_token');
    print('Token cleared');
  }

  Widget otpTextField(TextEditingController controller,
      {required bool first, required bool last}) {
    return Container(
      width: 45, // Set the square size
      height: 45,
      margin: const EdgeInsets.symmetric(horizontal: 0.6),
      decoration: BoxDecoration(
        border: Border.all(
          width: 1,
          color: correct ? Colors.blueGrey : Colors.red, // Red border on error
        ),
        borderRadius: BorderRadius.circular(6),
        color: const Color.fromARGB(255, 255, 255, 255),
      ),
      child: TextField(
        controller: controller,
        autofocus: first, // Only autofocus the first field
        textAlign: TextAlign.center,
        style: const TextStyle(
          fontSize: 24,
          fontFamily: 'Zain',
        ),
        keyboardType: TextInputType.number,
        maxLength: 1,
        decoration: const InputDecoration(
          border: InputBorder.none,
          counterText: '', // Removes the character counter below the field
          contentPadding: EdgeInsets.symmetric(vertical: 4.0),
        ),
        onChanged: (value) {
          if (value.length == 1 && !last) {
            FocusScope.of(context).nextFocus(); // Move to next field
          } else if (value.isEmpty && !first) {
            FocusScope.of(context).previousFocus(); // Move to previous field
          }
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 30),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              "لقد أرسلنا رمز التحقق إلى جوالك\n :الرجاء إدخاله للتحقق",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                fontFamily: 'Zain',
              ),
            ),
            const SizedBox(height: 40),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                otpTextField(c1, first: true, last: false),
                otpTextField(c2, first: false, last: false),
                otpTextField(c3, first: false, last: false),
                otpTextField(c4, first: false, last: false),
                otpTextField(c5, first: false, last: false),
                otpTextField(c6, first: false, last: true),
              ],
            ),
            const SizedBox(height: 20),
            // Display error message if OTP is incorrect
            if (!correct)
              const Text(
                'الرمز المدخل غير صحيح. حاول مرة أخرى',
                style: TextStyle(color: Colors.red, fontFamily: 'Zain'),
              ),
            const SizedBox(height: 20),
            isLoading
                ? const CircularProgressIndicator(
                    color:
                        Color.fromRGBO(196, 174, 87, 1.0), // Set loading color
                  )
                : ElevatedButton(
                    onPressed: verifyOtp,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color.fromRGBO(1, 57, 31, 1.0),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                    ),
                    child: const Text(
                      'تحقق',
                      style: TextStyle(
                          fontSize: 18,
                          color: Colors.white,
                          fontFamily: 'Zain'),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}
