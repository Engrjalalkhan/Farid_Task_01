/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import QRCode from 'react-native-qrcode-svg';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {InterstitialAd, AdEventType} from 'react-native-google-mobile-ads';

// Replace this with your actual AdMob Interstitial Ad Unit ID
const adUnitId = 'ca-app-pub-7220390534702309/1143784295';

const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [networkCategory, setNetworkCategory] = useState('HOME');
  const [encryptionType, setEncryptionType] = useState('NONE');
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [viewQRCodeModalVisible, setViewQRCodeModalVisible] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [qrCodes, setQrCodes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    loadQrCodes();
    loadFavorites();
    loadAd();

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('Interstitial ad loaded');
      },
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      error => {
        console.error('Failed to load interstitial ad:', error);
        loadAd(); // Reload the ad if there was an error
      },
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('Interstitial ad closed');
        loadAd(); // Reload the ad after it’s closed
      },
    );

    // Clean up listeners on component unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
    };
  }, []);

  const loadQrCodes = async () => {
    try {
      const storedQrCodes = await AsyncStorage.getItem('qrCodes');
      if (storedQrCodes) {
        setQrCodes(JSON.parse(storedQrCodes));
      }
    } catch (error) {
      console.error('Failed to load QR codes:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const saveQrCodes = async codes => {
    try {
      await AsyncStorage.setItem('qrCodes', JSON.stringify(codes));
    } catch (error) {
      console.error('Failed to save QR codes:', error);
    }
  };

  const saveFavorites = async favorites => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const loadAd = () => {
    if (!interstitial.loaded) {
      interstitial.load();
    }
  };

  const showInterstitialAd = () => {
    if (interstitial.loaded) {
      interstitial.show();
      loadAd(); // Reload the ad after showing it
    } else {
      console.log('Interstitial ad not loaded, loading now...');
      loadAd(); // Load the ad if not already loaded
    }
  };

  const handleViewQRCode = () => {
    showInterstitialAd();
    setSuccessModalVisible(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleGenerateQRCode = () => {
    if (!username || !password || encryptionType === 'NONE') {
      Alert.alert('Error', 'Please fill in all the required fields');
      return;
    }

    setLoadingModalVisible(true);

    const qrData = {
      username,
      password,
      networkCategory,
      encryptionType,
    };

    setTimeout(() => {
      setLoadingModalVisible(false);
      const qrValue = JSON.stringify(qrData);
      const newQrCodes = [...qrCodes, qrValue];
      setQrCodes(newQrCodes);
      setQrCodeValue(qrValue);
      setSuccessModalVisible(true);
      saveQrCodes(newQrCodes);
    }, 2000); // Simulate a network request or processing delay
  };

  const handleDeleteQRCode = index => {
    const newQrCodes = qrCodes.filter((_, i) => i !== index);
    setQrCodes(newQrCodes);
    const newFavorites = favorites.filter((_, i) => i !== index);
    setFavorites(newFavorites);
    saveQrCodes(newQrCodes);
    saveFavorites(newFavorites);
  };

  const handleShareQRCode = qrValue => {
    setQrCodeValue(qrValue);
    setViewQRCodeModalVisible(true);
  };

  const handleFavoriteQRCode = qrValue => {
    let newFavorites;
    if (favorites.includes(qrValue)) {
      newFavorites = favorites.filter(item => item !== qrValue);
    } else {
      newFavorites = [...favorites, qrValue];
    }
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const renderQrCodeCard = ({item, index}) => (
    <View style={styles.qrCodeCard}>
      <View style={styles.qrCodeHeader}>
        <Text style={styles.usernameText}>{JSON.parse(item).username}</Text>
        <TouchableOpacity onPress={() => handleFavoriteQRCode(item)}>
          <Icon
            name="star"
            size={24}
            color={favorites.includes(item) ? 'gold' : '#000'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.qrCodeContent}>
        <View style={styles.detailsContainer}>
          <Text style={styles.networkCategoryText}>
            <Icon name="home" size={16} color="#000" />{' '}
            {JSON.parse(item).networkCategory}
          </Text>
          <Text style={styles.encryptionTypeText}>
            <MaterialIcons name="security" size={16} color="#000" />{' '}
            {JSON.parse(item).encryptionType}
          </Text>
        </View>
        <TouchableOpacity style={styles.qrCodeIconContainer}>
          <Icon name="qrcode" size={50} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.qrCodeActions}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleShareQRCode(item)}
            style={{
              backgroundColor: '#2196F3',
              width: '60%',
              borderRadius: 10,
              height: 30,
            }}>
            <Text style={styles.buttonTextcard}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteQRCode(index)}>
            <Icon name="trash" size={30} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wi-Fi-Share</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Favorite', {favoriteCodes: favorites})
          }>
          <Icon name="star" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {qrCodes.length === 0 ? (
        <View style={styles.iconContainer}>
          <MaterialIcons name="wifi-off" size={35} color="#000" />
          <Text style={styles.noQrText}>No QR Codes Yet</Text>
          <Text style={styles.noQrSubText}>
            You have not created any QR codes yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={qrCodes}
          renderItem={renderQrCodeCard}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true} // Enable horizontal scrolling for the FlatList
        />
      )}

      <View style={styles.shareContainer}>
        <Text style={styles.shareText}>Share your WiFi</Text>
        <Text style={styles.shareSubText}>
          Enter your WiFi details to generate a QR code
        </Text>

        <View style={styles.inputContainer}>
          <Icon name="user" size={24} color="#000" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#000" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={passwordVisible ? 'eye' : 'eye-slash'}
              size={24}
              color="#000"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.categoryText}>Network Category</Text>
        <View style={styles.buttonContainer}>
          {['HOME', 'OFFICE', 'OTHER'].map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                networkCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setNetworkCategory(category)}>
              <Text style={styles.buttonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.categoryText}>Encryption Type</Text>
        <View style={styles.buttonContainer}>
          {['NONE', 'WEP', 'WPA'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.categoryButton,
                encryptionType === type && styles.categoryButtonActive,
              ]}
              onPress={() => setEncryptionType(type)}>
              <Text style={styles.buttonText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateQRCode}>
          <Text style={styles.generateButtonText}>Generate QR Code</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Modal */}
      <Modal
        transparent={true}
        visible={loadingModalVisible}
        animationType="fade"
        onRequestClose={() => setLoadingModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.modalText}>Generating...</Text>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        transparent={true}
        visible={successModalVisible}
        animationType="fade"
        onRequestClose={() => setSuccessModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.successModalContent}>
            <Icon name="check-circle" size={50} color="green" />
            <Text style={styles.successText}>QR Code Generated</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                showInterstitialAd();
                setSuccessModalVisible(false);
                handleViewQRCode();
              }}>
              <Text style={styles.closeButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* View QR Code Modal */}
      <Modal
        transparent={true}
        visible={viewQRCodeModalVisible}
        animationType="fade"
        onRequestClose={() => setViewQRCodeModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.viewQRCodeModalContent}>
            {/* Display the Username */}
            {(() => {
              if (!qrCodeValue) {
                return (
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalErrorText}>
                      No QR code data available
                    </Text>
                  </View>
                );
              }

              try {
                const qrData = JSON.parse(qrCodeValue);

                if (!qrData || !qrData.username) {
                  return (
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalErrorText}>
                        Username not found in QR code data
                      </Text>
                    </View>
                  );
                }

                return (
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalUsernameText}>
                      {qrData.username}
                    </Text>
                  </View>
                );
              } catch (error) {
                console.error('Failed to parse QR code data:', error);
                return (
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalErrorText}>
                      Failed to load QR code data.
                    </Text>
                  </View>
                );
              }
            })()}

            {/* Display the QR Code */}
            <QRCode value={qrCodeValue} size={200} />

            {/* Display network category and encryption type in a row */}
            {(() => {
              if (!qrCodeValue) {
                return (
                  <View style={styles.modalDetailsContainer}>
                    <Text style={styles.modalDetailsText}>
                      No QR code data available
                    </Text>
                  </View>
                );
              }

              try {
                const qrData = JSON.parse(qrCodeValue);
                return (
                  <View style={styles.modalDetailsContainer}>
                    <Text style={styles.modalDetailsText}>
                      <Icon name="home" size={16} color="#000" />{' '}
                      {qrData.networkCategory || 'N/A'}
                    </Text>
                    <Text style={styles.modalDetailsText}>
                      <MaterialIcons name="security" size={16} color="#000" />{' '}
                      {qrData.encryptionType || 'N/A'}
                    </Text>
                  </View>
                );
              } catch (error) {
                console.error('Failed to parse QR code data:', error);
                return (
                  <View style={styles.modalDetailsContainer}>
                    <Text style={styles.modalDetailsText}>
                      Invalid QR code data
                    </Text>
                  </View>
                );
              }
            })()}

            {/* Close and Download buttons */}
            <View style={styles.buttonContainerqr}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setViewQRCodeModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.downloadButton}
                // onPress={handleDownload}
              >
                <MaterialIcons
                  name="file-download"
                  size={24}
                  color="#fff"
                  style={{alignSelf: 'center'}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  noQrText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  noQrSubText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  qrCodeCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    width: 200,
  },
  qrCodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  qrCodeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  qrCodeIconContainer: {
    marginLeft: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  networkCategoryText: {
    fontSize: 14,
    color: '#777',
    marginTop: 8,
  },
  encryptionTypeText: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  qrCodeActions: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  buttonTextcard: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  shareContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingTop: 30,
    marginTop: 50,
    maxWidth: 350,
    borderWidth: 1,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  shareText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'center',
  },
  shareSubText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 4,
  },
  categoryButtonActive: {
    backgroundColor: '#ddd',
  },
  buttonText: {
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  successModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  viewQRCodeModalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    marginBottom: 10,
  },
  modalUsernameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    width: '100%',
  },
  modalDetailsText: {
    fontSize: 14,
    marginHorizontal: 10,
  },
  buttonContainerqr: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  downloadButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    borderRadius: 100,
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  modalErrorText: {
    fontSize: 14,
    color: 'red',
    marginTop: 10,
  },
});

export default HomeScreen;
