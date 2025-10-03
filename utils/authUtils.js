import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';

export const validateLoginForm = (email, password) => {
    const errors = {};
    
    if (!email.trim()) {
        errors.email = 'Vui lòng nhập email.';
    }
    if (!password) {
        errors.password = 'Vui lòng nhập mật khẩu.';
    }
    
    return errors;
};

export const validateSignUpForm = (username, email, password) => {
    const errors = {};
    
    if (!username.trim()) {
        errors.username = 'Vui lòng nhập tên người dùng.';
    }
    if (!email.trim()) {
        errors.email = 'Vui lòng nhập email.';
    }
    if (!password) {
        errors.password = 'Vui lòng nhập mật khẩu.';
    }
    
    return errors;
};

export const handleLogin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        if (!user) {
            throw new Error('User is undefined');
        }

        // Lấy thông tin người dùng từ Firestore
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            return { success: true, username: userData.username };
        } else {
            throw new Error('User data not found.');
        }
    } catch (error) {
        return { success: false, error };
    }
};

export const handleSignUp = async (username, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        if (user) {
            const userDocRef = doc(firestore, 'users', user.uid);
            await setDoc(userDocRef, {
                username: username,
                email: email,
                createdAt: new Date(),
            });
            return { success: true };
        }
    } catch (error) {
        return { success: false, error };
    }
};

export const getAuthErrorMessage = (error) => {
    switch (error.code) {
        case 'auth/user-not-found':
            return { email: 'Không tìm thấy người dùng với email này.', general: 'Thông tin đăng nhập không hợp lệ.' };
        case 'auth/wrong-password':
            return { password: 'Mật khẩu không đúng.', general: 'Thông tin đăng nhập không hợp lệ.' };
        case 'auth/invalid-login-credentials':
            return { general: 'Email hoặc mật khẩu không đúng.' };
        case 'auth/invalid-email':
            return { email: 'Email không hợp lệ.', general: 'Vui lòng kiểm tra lại thông tin.' };
        case 'auth/too-many-requests':
            return { general: 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.' };
        case 'auth/email-already-in-use':
            return { email: 'Email đã được đăng ký.', general: 'Email đã được đăng ký. Vui lòng sử dụng email khác.' };
        case 'auth/weak-password':
            return { password: 'Mật khẩu phải có ít nhất 6 ký tự.', general: 'Mật khẩu chưa đủ mạnh.' };
        case 'auth/operation-not-allowed':
            return { general: 'Tài khoản email/password chưa được bật trong Firebase Auth.' };
        default:
            return { general: 'Có lỗi xảy ra. Vui lòng thử lại.' };
    }
};
