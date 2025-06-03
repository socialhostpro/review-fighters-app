import React, { useState } from 'react';
import { Building2, Play, CheckCircle, Clock, ArrowRight, User, Mail, DollarSign } from 'lucide-react';
import { onboardingService } from '../../services/onboardingService';

const OnboardingDemoPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runCompleteOnboardingFlow = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setLogs([]);
    setApplicationId(null);

    try {
      // Step 1: Business owner signs up
      setCurrentStep(1);
      addLog("🏢 Business owner starting signup...");
      await sleep(1000);

      const application = await onboardingService.initiateOnboarding(
        'USER_DEMO_123',
        'demo@restaurantabc.com'
      );
      setApplicationId(application.applicationId);
      addLog(`✅ Signup completed! Application ID: ${application.applicationId}`);
      addLog("📧 Notifications sent to admins and owners");
      await sleep(2000);

      // Step 2: Complete business information
      setCurrentStep(2);
      addLog("📋 Filling out business information...");
      await sleep(1500);

      await onboardingService.submitBusinessInfo(application.applicationId, {
        businessName: "ABC Restaurant",
        businessType: "Restaurant",
        businessDescription: "Family-owned Italian restaurant serving authentic cuisine since 1985",
        website: "https://www.abc-restaurant.com",
        phoneNumber: "(555) 123-4567",
        email: "info@abc-restaurant.com",
        address: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
        numberOfEmployees: 25,
        annualRevenue: "500k-1M",
        currentReviewPlatforms: ["Google", "Yelp", "TripAdvisor"],
        painPoints: "Managing negative reviews and increasing positive review volume",
        goals: "Improve online reputation and increase customer trust",
        additionalInfo: "Looking for comprehensive review management solution"
      });
      addLog("✅ Business information submitted");
      await sleep(1500);

      // Step 3: Confirm subscription
      setCurrentStep(3);
      addLog("💳 Confirming subscription...");
      await sleep(1500);

      await onboardingService.confirmSubscription(application.applicationId, {
        planType: "Professional",
        billingCycle: "Monthly",
        amount: 199,
        paymentMethodId: "pm_demo_123",
        subscriptionId: "sub_demo_456"
      });
      addLog("✅ Subscription confirmed ($199/month Professional plan)");
      addLog("📧 Welcome email sent to customer");
      addLog("📧 Notifications sent to admins and owners");
      addLog("👥 Application assigned to all staff for review");
      await sleep(2000);

      // Step 4: Staff accepts and reviews
      setCurrentStep(4);
      addLog("👨‍💼 Staff member accepting review task...");
      await sleep(1500);

      // Get staff tasks and accept one
      const staffTasks = await onboardingService.getTasksForStaff('STAFF_001');
      const relevantTask = staffTasks.find(task => task.applicationId === application.applicationId);
      
      if (relevantTask) {
        await onboardingService.acceptReviewTask(relevantTask.taskId, 'STAFF_001');
        addLog("✅ Staff member accepted review task");
        await sleep(1500);

        addLog("🔍 Staff reviewing application details...");
        await sleep(2000);

        // Approve the application
        addLog("✅ Staff approving application...");
        await onboardingService.completeReview(
          relevantTask.taskId,
          true,
          "Excellent business profile. All requirements met. Approved for Review Fighters platform.",
          undefined
        );
        addLog("✅ Application APPROVED!");
        addLog("📧 Approval notifications sent to customer, admins, and owners");
        await sleep(2000);

        // Step 5: Account activation
        setCurrentStep(5);
        addLog("🎉 Account being activated...");
        await sleep(1500);
        addLog("✅ Account is now ACTIVE!");
        addLog("📧 Final welcome email sent to customer");
      } else {
        addLog("❌ No staff task found for this application");
      }

      setCurrentStep(6);
      addLog("🎊 ONBOARDING COMPLETE!");
      addLog("The business owner can now access all Review Fighters features");

    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const stepLabels = [
    "Ready to start",
    "Business Signup",
    "Business Information",
    "Subscription Confirmation", 
    "Staff Review & Approval",
    "Account Activation",
    "Complete!"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Onboarding Flow Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch the complete business owner onboarding process from signup to account activation,
            including notifications and staff review workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Demo Control</h2>
            
            <button
              onClick={runCompleteOnboardingFlow}
              disabled={isRunning}
              className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                isRunning
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
              }`}
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Running Demo...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-3" />
                  Run Complete Onboarding Flow
                </>
              )}
            </button>

            {/* Progress Steps */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-3">
                {stepLabels.map((label, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < currentStep ? 'bg-green-500 text-white' :
                      index === currentStep && isRunning ? 'bg-blue-500 text-white animate-pulse' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : index === currentStep && isRunning ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-sm ${
                      index < currentStep ? 'text-green-600 font-medium' :
                      index === currentStep && isRunning ? 'text-blue-600 font-medium' :
                      'text-gray-600'
                    }`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Info */}
            {applicationId && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Demo Application</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>ABC Restaurant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>demo@restaurantabc.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Professional Plan - $199/month</span>
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    ID: {applicationId}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Log */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Live Activity Log</h2>
            
            <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-400 text-center mt-20">
                  Click "Run Complete Onboarding Flow" to see live activity...
                </div>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-green-400">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flow Description */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Onboarding Flow Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">1</div>
                <h3 className="font-semibold text-gray-900">Business Signup</h3>
              </div>
              <p className="text-sm text-gray-600">
                Business owner creates account and provides basic information. Notifications sent to admins and owners.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">2</div>
                <h3 className="font-semibold text-gray-900">Business Details</h3>
              </div>
              <p className="text-sm text-gray-600">
                Complete business profile including type, description, contact info, and goals.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">3</div>
                <h3 className="font-semibold text-gray-900">Subscription</h3>
              </div>
              <p className="text-sm text-gray-600">
                Choose and confirm subscription plan. Welcome email sent to customer, notifications to team.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">4</div>
                <h3 className="font-semibold text-gray-900">Staff Assignment</h3>
              </div>
              <p className="text-sm text-gray-600">
                Application automatically assigned to all staff members as review tasks with priority and deadlines.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">5</div>
                <h3 className="font-semibold text-gray-900">Review & Approval</h3>
              </div>
              <p className="text-sm text-gray-600">
                Staff reviews application details and approves/rejects. Notifications sent based on decision.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">6</div>
                <h3 className="font-semibold text-gray-900">Account Activation</h3>
              </div>
              <p className="text-sm text-gray-600">
                Account activated and customer can access all Review Fighters features. Final welcome email sent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDemoPage; 