import 'package:flutter/material.dart';
import 'package:parent_application/core/utils/app_colors.dart';

class AddmychildView extends StatefulWidget {
  const AddmychildView({super.key});

  @override
  _AddMyChildViewState createState() => _AddMyChildViewState();
}

class _AddMyChildViewState extends State<AddmychildView> {
  bool showForm = false; // To control form visibility
  bool isSubmitting = false; // For showing a loading indicator

  // Controllers for form fields
  final TextEditingController nameController = TextEditingController();
  final TextEditingController ageController = TextEditingController();
  final TextEditingController locationController = TextEditingController();

  String? selectedGrade; // To store selected grade

  // Global key to track form state
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection:
          TextDirection.rtl, // Set right-to-left layout for the entire app
      child: Scaffold(
        appBar: AppBar(
          title: Text(showForm ? "إضافة معلومات الطفل" : "إضافة طفل"),
          leading: showForm
              ? IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () {
                    setState(() {
                      showForm =
                          false; // Hide the form and return to the add button view
                    });
                  },
                )
              : null, // Only show back arrow when in the form view
          centerTitle: true, // Center the title
        ),
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                if (!showForm) ...[
                  Center(
                    
                    child: ElevatedButton(
                      onPressed: () {
                        setState(() {
                          showForm =
                              true; // Show the form when the button is clicked
                        });
                      },
                      child: const Text("إضافة طفل"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor:
                            AppColors.thColor, // Button background color
                        foregroundColor: Colors.white,
                        textStyle: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24, 
                          vertical: 12, 
                        ),
                        elevation: 5, // shadow effect
                        shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(12), // Rounded corners
                        ),
                      ),
                    ),
                  ),
                ] else ...[
                  Form(
                    key: _formKey, // Form key
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const SizedBox(height: 16),
                        // Form fields
                        TextFormField(
                          controller: nameController,
                          textAlign:
                              TextAlign.right, // Align input text to the right
                          textDirection: TextDirection
                              .rtl, // Set text direction for Arabic
                          decoration: const InputDecoration(
                            labelText: "اسم الطفل",
                            border: OutlineInputBorder(),
                            labelStyle: TextStyle(fontSize: 18),
                          ),
                          keyboardType: TextInputType.text, // Allow text input
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'يجب إدخال اسم الطفل';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: ageController,
                          textAlign:
                              TextAlign.right, // Align input text to the right
                          textDirection: TextDirection
                              .rtl, // Set text direction for Arabic
                          decoration: const InputDecoration(
                            labelText: "عمر الطفل",
                            border: OutlineInputBorder(),
                            labelStyle: TextStyle(fontSize: 18),
                          ),
                          keyboardType:
                              TextInputType.number, // Only numeric input
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'يجب إدخال عمر الطفل';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        // Dropdown for child's grade
                        DropdownButtonFormField<String>(
                          value: selectedGrade,
                          decoration: const InputDecoration(
                            labelText: "صف الطفل",
                            border: OutlineInputBorder(),
                            labelStyle: TextStyle(fontSize: 18),
                          ),
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
                          ].map<DropdownMenuItem<String>>((String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text(value, textAlign: TextAlign.right),
                            );
                          }).toList(),
                          onChanged: (String? newValue) {
                            setState(() {
                              selectedGrade =
                                  newValue; // Update the selected grade
                            });
                          },
                          validator: (value) {
                            if (value == null) {
                              return 'يجب اختيار صف الطفل';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        Align(
                          alignment:
                              Alignment.centerRight,
                          child: Text(
                            "موقع المنزل",
                            style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: AppColors.sColor),
                            textAlign:
                                TextAlign.right, // Align text to the right
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: locationController,
                          textAlign:
                              TextAlign.right, // Align input text to the right
                          textDirection: TextDirection
                              .rtl, // Set text direction for Arabic
                          decoration: const InputDecoration(
                            labelText: "عنوان المنزل",
                            border: OutlineInputBorder(),
                            labelStyle: TextStyle(fontSize: 18),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'يجب إدخال عنوان المنزل';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        if (isSubmitting)
                          const CircularProgressIndicator() // Show loading indicator when submitting
                        else
                          Align(
                            alignment: Alignment
                                .centerRight, // Align button to the right
                            child: ElevatedButton(
                              onPressed: () async {
                                if (_formKey.currentState?.validate() ??
                                    false) {
                                  // Show loading indicator
                                  setState(() {
                                    isSubmitting = true;
                                  });

                                  // Simulate an API call or operation
                                  bool success = await addChild();

                                  // Hide loading indicator
                                  setState(() {
                                    isSubmitting = false;
                                  });

                                  // Show confirmation message
                                  if (success) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('تم إضافة الطفل بنجاح!'),
                                        backgroundColor: Colors.green,
                                      ),
                                    );
                                    // Clear the form after submission
                                    nameController.clear();
                                    ageController.clear();
                                    locationController.clear();
                                    selectedGrade =
                                        null; // Clear the selected grade

                                    setState(() {
                                      showForm =
                                          false; // Hide the form after submission
                                    });
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
                              child: const Text("إضافة"),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors
                                    .thColor,
                                foregroundColor: Colors.white,
                                textStyle: const TextStyle(
                                    fontSize: 18),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Mock function to simulate an API call
  Future<bool> addChild() async {
    await Future.delayed(const Duration(seconds: 2)); // Simulate network delay
    return true; // You can toggle this between true/false to simulate success or failure
  }
}
