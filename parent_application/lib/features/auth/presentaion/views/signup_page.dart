import 'package:flutter/material.dart';
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