import 'package:flutter/material.dart';
// import 'package:maslak/core/utils/app_assets.dart';
import 'package:parent_application/core/utils/app_colors.dart';
// import 'package:flutter/material.dart';
// import 'package:parent_application/core/utils/app_colors.dart';
import 'package:parent_application/features/myaccount/presentation/views/EditMyAccountView.dart';

class MyaccountView extends StatelessWidget {
  const MyaccountView({super.key});

  @override
  Widget build(BuildContext context) {
    var isDark = MediaQuery.of(context).platformBrightness == Brightness.dark;
    return Scaffold(
      appBar: AppBar(
        // leading: IconButton(onPressed: () {}, icon: const Icon(Icons.person)),

        title: const Text(
          "الملف الشخصي",
          textDirection: TextDirection.rtl,
        ),
        centerTitle: true, // This centers the title

        // actions: [
        //   IconButton(
        //       onPressed: () {},
        //       icon: Icon(isDark ? Icons.light_mode : Icons.dark_mode))
        // ],
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(4),
          child: Column(
            children: [
              // Profile Picture with Pencil Icon Overlay
              Stack(
                children: [
                  SizedBox(
                    width: 120,
                    height: 120,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(100),
                      child: Image.asset('assets/images/profilephoto1.png'),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: GestureDetector(
                      onTap: () {
                        // Navigate to the EditMyAccount page
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const EditMyAccount(),
                          ),
                        );
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.thColor,
                        ),
                        padding: const EdgeInsets.all(4.0),
                        child: const Icon(
                          Icons.edit,
                          size: 20,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              // Profile name and number
              Column(
                children: [
                  Text(
                    "نورة",
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 24,
                        ),
                  ),
                  const SizedBox(
                      height: 5), // Add spacing between name and number
                  Text(
                    "+966123456789", // Phone number
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w400,
                          fontSize: 16,
                        ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                "noramohamed@gmail.com",
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w300,
                    ),
              ),
              const SizedBox(height: 20),
              // تعديل button to navigate to EditMyAccount page
              SizedBox(
                width: 200,
                child: ElevatedButton(
                  onPressed: () {
                    // Navigate to the EditMyAccount page
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const EditMyAccount(),
                      ),
                    );
                  },
                  child: const Text("تعديل"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.thColor,
                    foregroundColor: Colors.white,
                    textStyle: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 30),
              const Divider(),
              const SizedBox(height: 10),
              // Menu items
              // myaccountMenuWidget(
              //   title: "إعدادات",
              //   icon: Icons.settings,
              //   onPressed: () {},
              // ),
              myaccountMenuWidget(
                title: "تسجيل خروج",
                icon: Icons.exit_to_app,
                textColor: Colors.red,
                endIcon: false,
                onPressed: () {},
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Widget for account menu
class myaccountMenuWidget extends StatelessWidget {
  const myaccountMenuWidget({
    Key? key,
    required this.title,
    required this.icon,
    required this.onPressed,
    this.endIcon = true,
    this.textColor,
  }) : super(key: key);

  final String title;
  final IconData icon;
  final VoidCallback onPressed;
  final bool endIcon;
  final Color? textColor;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end, // Align to the right
          children: [
            Text(
              title,
              style: Theme.of(context)
                  .textTheme
                  .bodyLarge
                  ?.copyWith(color: textColor),
            ),
            const SizedBox(width: 10),
            Icon(
              icon,
              color: textColor ?? Colors.black,
            ),
          ],
        ),
      ),
    );
  }
}
