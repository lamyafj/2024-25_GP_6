import 'package:flutter/material.dart';

class LiveLocationView extends StatelessWidget {
  const LiveLocationView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("موقع الباص المباشر", textDirection: TextDirection.rtl),
        centerTitle: true, // This centers the title
      ),
      body: Center(
        child: const Text("موقع الباص هنا.", textDirection: TextDirection.rtl), // Placeholder text
      ),
    );
  }
}
