import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class ChildService {
  final storage = const FlutterSecureStorage();

  Future<List<dynamic>> fetchChildren(String idToken) async {
    try {
      // Retrieve the parent's uid (assuming it's saved in Firebase Auth)
    String? uid = await storage.read(key: 'nationalID'); // This is the UID

      if (uid == null) {
        print("Error: No uid found for parent");
        throw Exception('No uid found');
      }

      print("Parent uid retrieved: $uid");

      // Construct the API URL with the uid
      final url = Uri.parse('http://10.0.2.2:5000/getChildrenData/$uid');

      // Log the full URL and token to ensure correct values
      print('Requesting: $url');
      print('Token being sent: $idToken');

      // Make the GET request to fetch children data
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $idToken',  // Send token as Bearer in Authorization header
          'Content-Type': 'application/json',  // Ensure JSON is used
        },
      );

      print('Response status code: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        // Parse and return the list of children
        final List<dynamic> children = jsonDecode(response.body);
        print("Children data loaded successfully: $children");
        return children;
      } else {
        print('Failed to load children. Status code: ${response.statusCode}');
        throw Exception('Failed to load children');
      }
    } catch (error) {
      print("Error fetching children: $error");
      throw Exception('Error fetching children: $error');
    }
  }
}
