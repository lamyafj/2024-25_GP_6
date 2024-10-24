/*import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';

class LoginPage extends StatefulWidget {
  LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _passwordVisible = false;

  @override
  void initState() {
    super.initState();
    _passwordVisible = false;
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
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
              padding:
                  const EdgeInsets.symmetric(horizontal: 35.0, vertical: 60.0),
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
                    // Email TextFormField
                    TextFormField(
                      controller: _emailController,
                      textAlign: TextAlign.right,
                      decoration: InputDecoration(
                        border: const OutlineInputBorder(),
                        label: Align(
                          alignment: Alignment.centerRight,
                          child: Text('البريد الإلكتروني'),
                        ),
                        hintText: 'البريد الإلكتروني',
                        hintStyle: const TextStyle(fontSize: 14),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال البريد الإلكتروني';
                        } else if (!RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
                            .hasMatch(value)) {
                          return 'يرجى إدخال بريد إلكتروني صالح';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    // Password TextFormField
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
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            context.go("/home");
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
                          cursor:
                              SystemMouseCursors.click, // Add pointer cursor
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
                    // GestureDetector(
                    //   onTap: () {
                    //     // Handle forgot password action here
                    //   },
                    //   child: const Center(
                    //     child: Text(
                    //       'نسيت كلمة المرور؟',
                    //       style: TextStyle(
                    //         fontSize: 18,
                    //         color: Color.fromRGBO(196, 174, 87, 1.0),
                    //         decoration: TextDecoration.underline,
                    //       ),
                    //     ),
                    //   ),
                    // ),
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
}*/
