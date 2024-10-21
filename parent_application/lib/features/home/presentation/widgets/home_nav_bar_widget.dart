import 'package:flutter/material.dart';
import 'package:parent_application/features/home/presentation/views/home_view.dart';
import 'package:parent_application/features/myaccount/presentation/views/myaccount_view.dart';
import 'package:parent_application/features/notification/presentation/views/notification_view.dart';
import 'package:persistent_bottom_nav_bar/persistent_bottom_nav_bar.dart';
import 'package:parent_application/core/utils/app_colors.dart'
    as coreColors; // Use a prefix for this import

PersistentTabController _controller = PersistentTabController();

class HomeNavBarWidget extends StatelessWidget {
  const HomeNavBarWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return PersistentTabView(
      context,
      screens: _buildScreens(),
      items: _navBarsItems(),
      controller: _controller,
      navBarStyle: NavBarStyle.style12,
      backgroundColor: Colors.white,
    );
  }

  List<Widget> _buildScreens() {
    return [
      const HomeView(), // Removed const
      const NotificationView(), // Removed const
      MyaccountView(), // Removed const
    ];
  }

  List<PersistentBottomNavBarItem> _navBarsItems() {
    return [
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.home),
        title: "Home",
        activeColorPrimary:
            coreColors.AppColors.sColor, // Use prefixed AppColors
        inactiveColorPrimary: Colors.grey,
      ),
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.notifications),
        title: "Notifications",
        activeColorPrimary:
            coreColors.AppColors.sColor, // Use prefixed AppColors
        inactiveColorPrimary: Colors.grey,
      ),
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.person),
        title: "Account",
        activeColorPrimary:
            coreColors.AppColors.sColor, // Use prefixed AppColors
        inactiveColorPrimary: Colors.grey,
      ),
    ];
  }
}
