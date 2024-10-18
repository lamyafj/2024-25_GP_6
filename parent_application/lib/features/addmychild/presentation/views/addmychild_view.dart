import 'package:flutter/material.dart';
import 'package:parent_application/core/utils/app_colors.dart';

class AddmychildView extends StatefulWidget {
  const AddmychildView({super.key});

  @override
  _AddMyChildViewState createState() => _AddMyChildViewState();
}

class _AddMyChildViewState extends State<AddmychildView> {
  bool isSubmitting = false;

  // Controllers for form fields
  final TextEditingController nameController = TextEditingController();
  final TextEditingController ageController = TextEditingController();
  final TextEditingController locationController = TextEditingController();
  final TextEditingController schoolCodeController = TextEditingController();
  final TextEditingController cityController = TextEditingController();
  final TextEditingController districtController = TextEditingController();
  final TextEditingController streetController = TextEditingController();
  final TextEditingController postalCodeController = TextEditingController();

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
                Align(
                  alignment: Alignment.center,
                  child: const Text(
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
                      TextFormField(
                        controller: schoolCodeController,
                        textAlign: TextAlign.right,
                        textDirection: TextDirection.rtl,
                        decoration: InputDecoration(
                          labelText: "رمز المدرسة",
                          
                          border:
                              const OutlineInputBorder(), // Default border shape
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: AppColors.sColor,
                                width: 2.0), // Change only color and width
                          ),
                          labelStyle: const TextStyle(fontSize: 18, fontFamily: 'Zain', ),
                          floatingLabelStyle: TextStyle(color: AppColors.sColor , fontFamily: 'Zain', ), 
                              errorStyle: const TextStyle(
                              fontFamily: 'Zain', // Custom font for error messages
                              fontSize: 14,
                              color: Colors.red, // Error message color
                            ),// Change label color when focused
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يجب إدخال رمز المدرسة';
                          } else if (value.length != 5) {
                            return 'يجب أن يتكون رمز المدرسة من 5 أرقام';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: nameController,
                        textAlign: TextAlign.right,
                        textDirection: TextDirection.rtl,
                        decoration: InputDecoration(
                          labelText: "اسم الطالب",
                          border:
                              const OutlineInputBorder(), // Default border shape
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: AppColors.sColor,
                                width: 2.0), // Change only color and width
                          ),
                          labelStyle: const TextStyle(fontSize: 18,fontFamily: 'Zain', ),
                          floatingLabelStyle: TextStyle(color: AppColors.sColor , fontFamily: 'Zain', ), // Change label color when focused
                        ),
                        keyboardType: TextInputType.text,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يجب إدخال اسم الطالب';
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        value: selectedGrade,
                        decoration: InputDecoration(
                          labelText: "صف الطالب",
                          border:
                              const OutlineInputBorder(), // Default border shape
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: AppColors.sColor,
                                width: 2.0), // Change only color and width
                          ),
                          labelStyle: const TextStyle(fontSize: 18, fontFamily: 'Zain', ),
                          floatingLabelStyle: TextStyle(color: AppColors.sColor , fontFamily: 'Zain', ), // Change label color when focused
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

                      // Slim line with centered text "عنوان المنزل"
                      Row(
                        children: [
                          Expanded(
                            child: Divider(
                              thickness: 1,
                              color: Colors.grey,
                              endIndent: 10, // Space between text and line
                            ),
                          ),
                          const Text(
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
                              indent: 10, // Space between text and line
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
                          border:
                              const OutlineInputBorder(), // Default border shape
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: AppColors.sColor,
                                width: 2.0), // Change only color and width
                          ),
                          labelStyle: const TextStyle(fontSize: 18 , fontFamily: 'Zain', ),
                          floatingLabelStyle: TextStyle(color: AppColors.sColor , fontFamily: 'Zain', ), // Change label color when focused
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
                          border:
                              const OutlineInputBorder(), // Default border shape
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: AppColors.sColor,
                                width: 2.0), // Change only color and width
                          ),
                          labelStyle: const TextStyle(fontSize: 18 , fontFamily: 'Zain', ),
                          floatingLabelStyle: TextStyle(color: AppColors.sColor, fontFamily: 'Zain', ), // Change label color when focused
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
                          border:
                              const OutlineInputBorder(), // Default border shape
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: AppColors.sColor,
                                width: 2.0), // Change only color and width
                          ),
                          labelStyle: const TextStyle(fontSize: 18 , fontFamily: 'Zain', ),
                          floatingLabelStyle: TextStyle(color: AppColors.sColor , fontFamily: 'Zain', ), // Change label color when focused
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
                        textAlign: TextAlign.right,
                        textDirection: TextDirection.rtl,
                        decoration: InputDecoration(
                          labelText: "الرمز البريدي",
                          border:
                              const OutlineInputBorder(), // Default border shape
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                                color: AppColors.sColor,
                                width: 2.0), // Change only color and width
                          ),
                          labelStyle: const TextStyle(fontSize: 18 , fontFamily: 'Zain', ),
                          floatingLabelStyle: TextStyle(color: AppColors.sColor, fontFamily: 'Zain', ), // Change label color when focused
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يجب إدخال الرمز البريدي';
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
                                setState(() {
                                  isSubmitting = true;
                                });

                                // Simulate an API call or operation
                                bool success = await addChild();

                                setState(() {
                                  isSubmitting = false;
                                });

                                if (success) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Center(
                                        child: Text('!تم إضافة الطالب بنجاح',
                                            style:
                                                TextStyle(color: Colors.black , fontFamily: 'Zain', )),
                                      ),
                                      backgroundColor: Color(0xFFE7F0EC),
                                    ),
                                  );

                                  // Clear the form after submission
                                  nameController.clear();
                                  ageController.clear();
                                  locationController.clear();
                                  schoolCodeController.clear();
                                  selectedGrade = null;

                                  setState(() {
                                    Navigator.pop(context);
                                  });
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Center(
                                        child: Text('!حدث خطأ أثناء الإضافة.',
                                            style:
                                                TextStyle(color: Colors.black , fontFamily: 'Zain', )),
                                      ),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                }
                              }
                            },
                            child: const Text("إضافة"),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFF01391F),
                              foregroundColor: Colors.white,
                              textStyle: const TextStyle(fontSize: 18 , fontFamily: 'Zain', ),
                            ),
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

  Future<bool> addChild() async {
    await Future.delayed(const Duration(seconds: 2));
    return true;
  }
}
