import 'package:flutter/material.dart';

class BottomImage extends StatelessWidget {
  const BottomImage({super.key});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.bottomCenter,
      child: Image.asset(
        'assets/images/Saudi.PNG',
        width: MediaQuery.of(context).size.width,
        height: 160,
        fit: BoxFit.cover,
      ),
    );
  }
}
