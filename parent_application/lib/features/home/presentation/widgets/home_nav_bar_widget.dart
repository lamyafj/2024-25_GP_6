// // import 'package:maslak/core/utils/app_assets.dart';
// import 'package:maslak/core/utils/app_colors.dart';
// import 'package:maslak/features/addmychild/presentation/views/addmychild_view.dart';
// // import 'package:maslak/features/addmychild/presentaion/views/addmychild_view.dart';
// // import 'package:maslak/features/home/presentation/cubit/home_cubit.dart';
// // import 'package:maslak/features/home/presentation/views/home_view.dart';
// // import 'package:maslak/features/myaccount/presentation/views/myaccount_view.dart';
// // import 'package:maslak/notification/search/presentaion/views/notification_view.dart';
// import 'package:flutter/material.dart';
// import 'package:maslak/features/myaccount/presentation/views/myaccount_view.dart';
// import 'package:maslak/features/notification/presentation/views/notification_view.dart';
// import 'package:persistent_bottom_nav_bar/persistent_bottom_nav_bar.dart';
// // import 'package:flutter_bloc/flutter_bloc.dart';
// // import 'package:flutter_svg/svg.dart';
// // import 'package:persistent_bottom_nav_bar/persistent_tab_view.dart';

// PersistentTabController _controller = PersistentTabController();

// class HomeNavBarWidget extends StatelessWidget {
//   const HomeNavBarWidget({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return PersistentTabView(
//       context,
//       screens: _buildScreens(),
//       items: _navBarsItems(),
//       controller: _controller,
//       navBarStyle: NavBarStyle.style12,
//       backgroundColor: AppColors.primaryColor,
//       decoration: const NavBarDecoration(
//         borderRadius: BorderRadius.only(
//             topLeft: Radius.circular(10), topRight: Radius.circular(10)),
//       ),
//     );
//   }
// }

// List<Widget> _buildScreens() {
//   return [
//     // BlocProvider(
//     //   create: (context) => HomeCubit()..getHistoricalPeridos(),
//     //   child: const HomeView(),
//     // ),
//     const AddmychildView(),
//     const NotificationView(),
//     const MyaccountView(),
//   ];
// }

// List<PersistentBottomNavBarItem> _navBarsItems() {
//   return [
//     PersistentBottomNavBarItem(
//       icon: const Icon(Icons.home),
//     ),
//     PersistentBottomNavBarItem(
//       icon: const Icon(Icons.add),
//     ),
//     PersistentBottomNavBarItem(
//       icon: const Icon(Icons.notifications),
//     ),
//     PersistentBottomNavBarItem(
//       icon: const Icon(Icons.person),
//     ),
//   ];
// }

import 'package:flutter/material.dart';
// import 'package:parent_application/features/addmychild/presentation/views/addmychild_view.dart';
import 'package:parent_application/features/home/presentation/views/home_view.dart';
import 'package:parent_application/features/myaccount/presentation/views/myaccount_view.dart';
import 'package:parent_application/features/notification/presentation/views/notification_view.dart';
import 'package:persistent_bottom_nav_bar/persistent_bottom_nav_bar.dart';
import 'package:parent_application/core/utils/app_colors.dart';

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
      // decoration: const NavBarDecoration(
      //   borderRadius: BorderRadius.only(
      //       topLeft: Radius.circular(10), topRight: Radius.circular(10)),
      // ),
    );
  }

  List<Widget> _buildScreens() {
    return [
      const HomeView(),
      // const AddmychildView(),
      const NotificationView(),
      const MyaccountView(),
    
    ];
  }

  List<PersistentBottomNavBarItem> _navBarsItems() {
    return [
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.home),
        title: "Home",
        activeColorPrimary: AppColors.sColor,
        inactiveColorPrimary: Colors.grey,
      ),
      // PersistentBottomNavBarItem(
      //   icon: const Icon(Icons.add),
      //   title: "Add",
      //   activeColorPrimary: Colors.white,
      //   inactiveColorPrimary: Colors.grey,
      // ),
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.notifications),
        title: "Notifications",
        activeColorPrimary: AppColors.sColor,
        inactiveColorPrimary: Colors.grey,
      ),
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.person),
        title: "Account",
        activeColorPrimary: AppColors.sColor,
        inactiveColorPrimary: Colors.grey,
      ),
    ];
  }
}
