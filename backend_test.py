import requests
import sys
import json
from datetime import datetime

class AgricultureAPITester:
    def __init__(self, base_url="https://agri-portal-8.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.farmer_token = None
        self.buyer_token = None
        self.farmer_user = None
        self.buyer_user = None
        self.product_id = None
        self.order_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, params=params)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json() if response.content else {}
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_farmer_registration(self):
        """Test farmer registration"""
        farmer_data = {
            "name": f"Test Farmer {datetime.now().strftime('%H%M%S')}",
            "email": f"farmer_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!",
            "role": "farmer",
            "phone": "1234567890",
            "location": "Test Farm Location"
        }
        
        success, response = self.run_test("Farmer Registration", "POST", "auth/register", 200, farmer_data)
        if success and 'access_token' in response:
            self.farmer_token = response['access_token']
            self.farmer_user = response['user']
            return True
        return False

    def test_buyer_registration(self):
        """Test buyer registration"""
        buyer_data = {
            "name": f"Test Buyer {datetime.now().strftime('%H%M%S')}",
            "email": f"buyer_{datetime.now().strftime('%H%M%S')}@test.com",
            "password": "TestPass123!",
            "role": "buyer",
            "phone": "0987654321",
            "location": "Test Buyer Location"
        }
        
        success, response = self.run_test("Buyer Registration", "POST", "auth/register", 200, buyer_data)
        if success and 'access_token' in response:
            self.buyer_token = response['access_token']
            self.buyer_user = response['user']
            return True
        return False

    def test_farmer_login(self):
        """Test farmer login"""
        if not self.farmer_user:
            return False
            
        login_data = {
            "email": self.farmer_user['email'],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test("Farmer Login", "POST", "auth/login", 200, login_data)
        return success and 'access_token' in response

    def test_buyer_login(self):
        """Test buyer login"""
        if not self.buyer_user:
            return False
            
        login_data = {
            "email": self.buyer_user['email'],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test("Buyer Login", "POST", "auth/login", 200, login_data)
        return success and 'access_token' in response

    def test_get_user_profile(self):
        """Test get user profile"""
        if not self.farmer_token:
            return False
            
        headers = {'Authorization': f'Bearer {self.farmer_token}'}
        success, response = self.run_test("Get User Profile", "GET", "auth/me", 200, headers=headers)
        return success

    def test_create_product(self):
        """Test creating a product as farmer"""
        if not self.farmer_token:
            return False
            
        product_data = {
            "name": "Test Tomatoes",
            "description": "Fresh organic tomatoes from our farm",
            "category": "vegetables",
            "price": 5.99,
            "quantity": 100.0,
            "unit": "kg",
            "location": "Test Farm Location",
            "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400"
        }
        
        headers = {'Authorization': f'Bearer {self.farmer_token}'}
        success, response = self.run_test("Create Product", "POST", "products", 200, product_data, headers)
        if success and 'id' in response:
            self.product_id = response['id']
            return True
        return False

    def test_get_products(self):
        """Test getting all products"""
        success, response = self.run_test("Get All Products", "GET", "products", 200)
        return success

    def test_get_products_with_category_filter(self):
        """Test getting products with category filter"""
        params = {"category": "vegetables"}
        success, response = self.run_test("Get Products by Category", "GET", "products", 200, params=params)
        return success

    def test_get_products_with_search(self):
        """Test getting products with search"""
        params = {"search": "tomato"}
        success, response = self.run_test("Get Products by Search", "GET", "products", 200, params=params)
        return success

    def test_get_single_product(self):
        """Test getting a single product"""
        if not self.product_id:
            return False
            
        success, response = self.run_test("Get Single Product", "GET", f"products/{self.product_id}", 200)
        return success

    def test_get_farmer_products(self):
        """Test getting farmer's products"""
        if not self.farmer_token:
            return False
            
        headers = {'Authorization': f'Bearer {self.farmer_token}'}
        success, response = self.run_test("Get Farmer Products", "GET", "farmer/products", 200, headers=headers)
        return success

    def test_update_product(self):
        """Test updating a product"""
        if not self.farmer_token or not self.product_id:
            return False
            
        update_data = {
            "price": 6.99,
            "quantity": 80.0
        }
        
        headers = {'Authorization': f'Bearer {self.farmer_token}'}
        success, response = self.run_test("Update Product", "PUT", f"products/{self.product_id}", 200, update_data, headers)
        return success

    def test_create_order(self):
        """Test creating an order as buyer"""
        if not self.buyer_token or not self.product_id:
            return False
            
        order_data = {
            "items": [{
                "product_id": self.product_id,
                "product_name": "Test Tomatoes",
                "quantity": 5.0,
                "unit": "kg",
                "price": 6.99,
                "total": 34.95
            }],
            "delivery_address": "123 Test Street, Test City, Test State 12345",
            "payment_method": "COD"
        }
        
        headers = {'Authorization': f'Bearer {self.buyer_token}'}
        success, response = self.run_test("Create Order", "POST", "orders", 200, order_data, headers)
        if success and 'id' in response:
            self.order_id = response['id']
            return True
        return False

    def test_get_buyer_orders(self):
        """Test getting buyer's orders"""
        if not self.buyer_token:
            return False
            
        headers = {'Authorization': f'Bearer {self.buyer_token}'}
        success, response = self.run_test("Get Buyer Orders", "GET", "orders", 200, headers=headers)
        return success

    def test_get_farmer_orders(self):
        """Test getting farmer's orders"""
        if not self.farmer_token:
            return False
            
        headers = {'Authorization': f'Bearer {self.farmer_token}'}
        success, response = self.run_test("Get Farmer Orders", "GET", "orders", 200, headers=headers)
        return success

    def test_get_single_order(self):
        """Test getting a single order"""
        if not self.buyer_token or not self.order_id:
            return False
            
        headers = {'Authorization': f'Bearer {self.buyer_token}'}
        success, response = self.run_test("Get Single Order", "GET", f"orders/{self.order_id}", 200, headers=headers)
        return success

    def test_update_order_status(self):
        """Test updating order status as farmer"""
        if not self.farmer_token or not self.order_id:
            return False
            
        headers = {'Authorization': f'Bearer {self.farmer_token}'}
        params = {"status": "confirmed"}
        success, response = self.run_test("Update Order Status", "PUT", f"orders/{self.order_id}/status", 200, headers=headers, params=params)
        return success

    def test_contact_form(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "1234567890",
            "subject": "Test Subject",
            "message": "This is a test message from the API test suite."
        }
        
        success, response = self.run_test("Contact Form", "POST", "contact", 200, contact_data)
        return success

    def test_delete_product(self):
        """Test deleting a product"""
        if not self.farmer_token or not self.product_id:
            return False
            
        headers = {'Authorization': f'Bearer {self.farmer_token}'}
        success, response = self.run_test("Delete Product", "DELETE", f"products/{self.product_id}", 200, headers=headers)
        return success

def main():
    print("🚀 Starting Agriculture API Testing...")
    tester = AgricultureAPITester()
    
    # Test sequence
    tests = [
        ("Root API Endpoint", tester.test_root_endpoint),
        ("Farmer Registration", tester.test_farmer_registration),
        ("Buyer Registration", tester.test_buyer_registration),
        ("Farmer Login", tester.test_farmer_login),
        ("Buyer Login", tester.test_buyer_login),
        ("Get User Profile", tester.test_get_user_profile),
        ("Create Product", tester.test_create_product),
        ("Get All Products", tester.test_get_products),
        ("Get Products by Category", tester.test_get_products_with_category_filter),
        ("Get Products by Search", tester.test_get_products_with_search),
        ("Get Single Product", tester.test_get_single_product),
        ("Get Farmer Products", tester.test_get_farmer_products),
        ("Update Product", tester.test_update_product),
        ("Create Order", tester.test_create_order),
        ("Get Buyer Orders", tester.test_get_buyer_orders),
        ("Get Farmer Orders", tester.test_get_farmer_orders),
        ("Get Single Order", tester.test_get_single_order),
        ("Update Order Status", tester.test_update_order_status),
        ("Contact Form", tester.test_contact_form),
        ("Delete Product", tester.test_delete_product),
    ]
    
    # Run all tests
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            tester.failed_tests.append({
                "test": test_name,
                "error": str(e)
            })
    
    # Print results
    print(f"\n📊 Test Results:")
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Tests failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"  - {failure['test']}: {failure.get('error', f\"Expected {failure.get('expected')}, got {failure.get('actual')}\"")}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())